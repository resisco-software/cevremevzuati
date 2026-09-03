import {
  classify,
  dayUrl,
  digest,
  fetchOfficial,
  istanbulDate,
  issueEntries,
  officialUrl,
  retryDelay,
  shiftDate,
} from './core.mjs';

export class Monitor {
  constructor(env, catalog, fetcher = fetch) {
    this.db = env.DB;
    this.evidence = env.EVIDENCE;
    this.catalog = catalog;
    this.fetcher = fetcher;
  }

  query(sql, ...values) {
    return this.db.prepare(sql).bind(...values);
  }

  async enqueue(payload, cycle, now) {
    const id = await digest(`${cycle}|${payload.kind}|${payload.url}`);
    await this.query(
      'INSERT OR IGNORE INTO jobs (id,payload,due_at) VALUES (?,?,?)',
      id,
      JSON.stringify({ ...payload, cycle }),
      now,
    ).run();
  }

  async seed(now = Date.now()) {
    const today = istanbulDate(now);
    const cycle = `${today}-${new Date(now).getUTCHours() < 15 ? 'am' : 'pm'}`;
    const watermark = await this.query(
      "SELECT value FROM meta WHERE key='last_enqueued_date'",
    ).first();
    let date = watermark?.value
      ? shiftDate(watermark.value, 1)
      : shiftDate(today, -2);
    const days = new Set([today, shiftDate(today, -1), shiftDate(today, -2)]);
    // Backfill at most seven days per cycle without skipping older unqueued days.
    let last = watermark?.value;
    for (let n = 0; date <= today && n < 7; n++, date = shiftDate(date, 1)) {
      days.add(date);
      last = date;
    }
    for (const day of days)
      await this.enqueue(
        {
          kind: 'issue',
          date: day,
          url: dayUrl(day),
          title: `${day} günlük indeks`,
        },
        cycle,
        now,
      );
    for (const record of this.catalog) {
      for (const url of new Set(
        [
          record.sourceUrl,
          record.consolidatedUrl,
          ...(record.changes ?? []).map((item) => item.sourceUrl),
        ].filter(Boolean),
      )) {
        await this.enqueue(
          {
            kind: 'known',
            url: officialUrl(url),
            title: record.title,
            slug: record.slug,
          },
          cycle,
          now,
        );
      }
    }
    if (last)
      await this.query(
        "INSERT INTO meta(key,value) VALUES('last_enqueued_date',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        last,
      ).run();
    await this.query(
      "INSERT INTO meta(key,value) VALUES('last_seed_at',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      String(now),
    ).run();
  }

  async event(kind, payload, details, previous, next, now) {
    const id = await digest(
      `${kind}|${payload.url}|${previous ?? ''}|${next ?? details.error ?? ''}`,
    );
    await this.query(
      `INSERT OR IGNORE INTO events
      (id,kind,url,title,publication_date,details,old_snapshot,new_snapshot,created_at)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      id,
      kind,
      payload.url,
      payload.title,
      payload.date ?? null,
      JSON.stringify(details),
      previous ?? null,
      next ?? null,
      now,
    ).run();
    return id;
  }

  async process(job, now = Date.now()) {
    const payload = JSON.parse(job.payload);
    try {
      const doc = await fetchOfficial(payload.url, this.fetcher);
      const entries =
        payload.kind === 'issue' ? issueEntries(doc, payload.date) : null;
      const rawHash = await digest(doc.bytes);
      const textHash = doc.readable ? await digest(doc.text) : rawHash;
      const snapshotId = await digest(`${payload.url}|${rawHash}`);
      const objectKey = `snapshots/${snapshotId}`;
      const previous = await this.query(
        `SELECT s.hash, p.text_hash FROM sources s
        LEFT JOIN snapshots p ON s.hash=p.id WHERE s.url=?`,
        payload.url,
      ).first();
      const alreadyStored = await this.query(
        'SELECT id FROM snapshots WHERE id=?',
        snapshotId,
      ).first();
      if (!alreadyStored) {
        await this.evidence.put(objectKey, doc.bytes, {
          httpMetadata: { contentType: 'application/octet-stream' },
        });
        await this.query(
          `INSERT OR IGNORE INTO snapshots
          (id,url,raw_hash,text_hash,object_key,content_type,size,fetched_at) VALUES(?,?,?,?,?,?,?,?)`,
          snapshotId,
          payload.url,
          rawHash,
          textHash,
          objectKey,
          doc.contentType,
          doc.bytes.length,
          now,
        ).run();
      }
      if (entries) {
        // No keyword filtering of index entries: even an omnibus law needs review.
        for (const link of entries.documents)
          await this.enqueue(
            { kind: 'discovery', ...link, date: payload.date },
            payload.cycle,
            now,
          );
        for (const link of entries.issues)
          await this.enqueue(
            { kind: 'issue', ...link, date: payload.date },
            payload.cycle,
            now,
          );
      } else {
        const analysis = classify(payload.title, doc, this.catalog);
        const registered = this.catalog.some((record) =>
          [
            record.sourceUrl,
            record.consolidatedUrl,
            ...(record.changes ?? []).map((item) => item.sourceUrl),
          ]
            .filter(Boolean)
            .some((url) => officialUrl(url) === payload.url),
        );
        const details = {
          ...analysis,
          record: payload.slug ?? null,
          fetchedUrl: doc.url,
          excerpt: doc.text.slice(0, 1400),
        };
        if (previous?.hash && previous.text_hash !== textHash) {
          await this.event(
            'source_changed',
            payload,
            details,
            previous.hash,
            snapshotId,
            now,
          );
        } else if (
          !previous?.hash &&
          !registered &&
          payload.kind === 'discovery'
        ) {
          await this.event(
            analysis.kind,
            payload,
            details,
            null,
            snapshotId,
            now,
          );
        }
        if (!doc.readable || doc.hasImages) {
          await this.event(
            'manual_text_review',
            payload,
            details,
            null,
            snapshotId,
            now,
          );
        }
        if (!previous?.hash && payload.kind === 'annex') {
          await this.event(
            'annex_review',
            payload,
            { ...details, parent: payload.parent },
            null,
            snapshotId,
            now,
          );
        }
        // Annexes remain linked to their parent; unsupported formats produce an alert.
        if (!payload.depth) {
          for (const link of doc.links.filter(
            (link) =>
              /(?:\.pdf|\.docx?|\.xlsx?|\.zip)$/i.test(
                new URL(link.url).pathname,
              ) || /\bek(?:ler|i)?\b/i.test(link.title),
          )) {
            if (link.url === payload.url) continue;
            await this.enqueue(
              {
                kind: 'annex',
                ...link,
                date: payload.date,
                depth: 1,
                parent: payload.url,
              },
              payload.cycle,
              now,
            );
          }
        }
      }
      await this.db.batch([
        this.query(
          `INSERT INTO sources(url,title,hash,checked_at) VALUES(?,?,?,?)
          ON CONFLICT(url) DO UPDATE SET title=excluded.title,hash=excluded.hash,
          checked_at=excluded.checked_at,error=NULL,error_at=NULL`,
          payload.url,
          payload.title,
          snapshotId,
          now,
        ),
        this.query(
          'UPDATE jobs SET completed_at=?,error=NULL WHERE id=?',
          now,
          job.id,
        ),
      ]);
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.slice(0, 500)
          : 'Kaynak işlenemedi';
      // A failed read never overwrites the successful snapshot or its checked_at.
      await this.db.batch([
        this.query(
          `INSERT INTO sources(url,title,error,error_at) VALUES(?,?,?,?)
          ON CONFLICT(url) DO UPDATE SET error=excluded.error,error_at=excluded.error_at`,
          payload.url,
          payload.title,
          message,
          now,
        ),
        this.query(
          'UPDATE jobs SET attempts=attempts+1,error=?,due_at=? WHERE id=?',
          message,
          now + retryDelay(job.attempts),
          job.id,
        ),
      ]);
      await this.event(
        'source_error',
        payload,
        {
          error: message,
          note: 'Bu kaynakta değişiklik yok denilemez; yeniden denenecek.',
        },
        null,
        null,
        now,
      );
      return false;
    }
  }

  async drain(now = Date.now()) {
    const lockValue = String(now + 12 * 60_000);
    const lock = await this.query(
      `INSERT INTO meta(key,value) VALUES('drain_lock',?)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(meta.value AS INTEGER) < ?`,
      lockValue,
      now,
    ).run();
    if (!lock.meta.changes) return { skipped: true };
    const runId = crypto.randomUUID();
    let processed = 0,
      failed = 0;
    try {
      await this.query(
        'INSERT INTO runs(id,started_at) VALUES(?,?)',
        runId,
        now,
      ).run();
      const jobs = await this.query(
        'SELECT * FROM jobs WHERE completed_at IS NULL AND due_at<=? ORDER BY due_at,id LIMIT 20',
        now,
      ).all();
      const seen = new Set();
      const distinctSources = jobs.results.filter((job) => {
        const url = JSON.parse(job.payload).url;
        if (seen.has(url)) return false;
        seen.add(url);
        return true;
      });
      for (let start = 0; start < distinctSources.length; start += 3) {
        const results = await Promise.all(
          distinctSources
            .slice(start, start + 3)
            .map((job) => this.process(job)),
        );
        processed += results.filter(Boolean).length;
        failed += results.filter((result) => !result).length;
      }
      await this.query(
        'UPDATE runs SET completed_at=?,processed=?,failed=? WHERE id=?',
        Date.now(),
        processed,
        failed,
        runId,
      ).run();
      return { processed, failed };
    } finally {
      await this.query(
        "DELETE FROM meta WHERE key='drain_lock' AND value=?",
        lockValue,
      ).run();
    }
  }

  async summary() {
    const [queue, events, errors, lastRun, coverage, seed] = await Promise.all([
      this.query(
        'SELECT COUNT(*) AS count FROM jobs WHERE completed_at IS NULL',
      ).first(),
      this.query(
        "SELECT kind,COUNT(*) AS count FROM events WHERE state='pending' GROUP BY kind",
      ).all(),
      this.query(
        'SELECT COUNT(*) AS count FROM sources WHERE error IS NOT NULL',
      ).first(),
      this.query('SELECT * FROM runs ORDER BY started_at DESC LIMIT 1').first(),
      this.query(
        'SELECT COUNT(*) AS count,MAX(checked_at) AS lastRead FROM sources WHERE checked_at IS NOT NULL',
      ).first(),
      this.query("SELECT value FROM meta WHERE key='last_seed_at'").first(),
    ]);
    return {
      queued: queue.count,
      pending: events.results,
      sourceErrors: errors.count,
      lastRun,
      coverage,
      lastSeedAt: seed ? Number(seed.value) : null,
      publicationRequiresReview: true,
      automaticLegalVerification: false,
    };
  }

  async review(id, decision, note, reviewer) {
    if (
      !['approved', 'rejected', 'carbon'].includes(decision) ||
      !note.trim() ||
      !reviewer.trim()
    )
      throw new Error('Karar, gerekçe ve inceleyen adı gerekli');
    if (note.length > 4000 || reviewer.length > 120)
      throw new Error('İnceleme metni çok uzun');
    const event = await this.query(
      'SELECT id FROM events WHERE id=?',
      id,
    ).first();
    if (!event) throw new Error('Kayıt bulunamadı');
    await this.db.batch([
      this.query(
        'INSERT INTO reviews(id,event_id,decision,note,reviewer,created_at) VALUES(?,?,?,?,?,?)',
        crypto.randomUUID(),
        id,
        decision,
        note,
        reviewer,
        Date.now(),
      ),
      this.query('UPDATE events SET state=? WHERE id=?', decision, id),
    ]);
    // Approval is an audit decision only. There is deliberately no catalog write.
  }
}
