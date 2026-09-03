import test from 'node:test';
import assert from 'node:assert/strict';
import { Monitor } from '../src/service.mjs';
import {
  catalog,
  htmlResponse,
  legalHtml,
  source,
  testStorage,
} from './helpers.mjs';

async function add(
  monitor,
  env,
  payload,
  cycle = crypto.randomUUID(),
  now = Date.now(),
) {
  await monitor.enqueue(payload, cycle, now);
  return env.DB.prepare(
    'SELECT * FROM jobs ORDER BY rowid DESC LIMIT 1',
  ).first();
}

test('known source baseline is not a legal amendment; real text differences preserve both snapshots', async () => {
  const env = testStorage();
  let content = legalHtml();
  const monitor = new Monitor(env, catalog, async () => htmlResponse(content));
  let job = await add(monitor, env, {
    kind: 'known',
    url: source,
    title: catalog[0].title,
  });
  assert.ok(await monitor.process(job, 1000));
  assert.equal((await monitor.summary()).pending.length, 0);
  content = content.replace('MADDE 1', 'MADDE   1');
  job = await add(monitor, env, {
    kind: 'known',
    url: source,
    title: catalog[0].title,
  });
  await monitor.process(job, 2000);
  assert.equal((await monitor.summary()).pending.length, 0);
  content = content.replace('MADDE   1', 'MADDE 2');
  job = await add(monitor, env, {
    kind: 'known',
    url: source,
    title: catalog[0].title,
  });
  await monitor.process(job, 3000);
  const event = await env.DB.prepare('SELECT * FROM events').first();
  assert.equal(event.kind, 'source_changed');
  assert.notEqual(event.old_snapshot, event.new_snapshot);
  assert.equal(env.blobs.size, 3);
  env.sqlite.close();
});

test('failed fetch preserves last successful timestamp and snapshot; error is durable and retryable', async () => {
  const env = testStorage();
  let fail = false;
  const monitor = new Monitor(env, catalog, async () =>
    fail ? new Response('down', { status: 503 }) : htmlResponse(legalHtml()),
  );
  let job = await add(monitor, env, {
    kind: 'known',
    url: source,
    title: 'Çevre',
  });
  await monitor.process(job, 1000);
  const before = await env.DB.prepare('SELECT * FROM sources').first();
  fail = true;
  job = await add(monitor, env, { kind: 'known', url: source, title: 'Çevre' });
  assert.equal(await monitor.process(job, 2000), false);
  const after = await env.DB.prepare('SELECT * FROM sources').first();
  assert.equal(after.checked_at, before.checked_at);
  assert.equal(after.hash, before.hash);
  assert.equal((await monitor.summary()).sourceErrors, 1);
  const retry = await env.DB.prepare('SELECT * FROM jobs WHERE id=?')
    .bind(job.id)
    .first();
  assert.equal(retry.completed_at, null);
  assert.equal(retry.attempts, 1);
  assert.ok(retry.due_at > 2000);
  env.sqlite.close();
});

test('new texts without keywords enter the scope queue and repeated reads do not duplicate reviews', async () => {
  const env = testStorage();
  const monitor = new Monitor(env, [], async () =>
    htmlResponse(legalHtml('Genel düzenleme')),
  );
  const payload = {
    kind: 'discovery',
    url: source,
    title: 'Genel düzenleme',
    date: '2026-09-02',
  };
  await monitor.process(await add(monitor, env, payload), 1000);
  const event = await env.DB.prepare('SELECT * FROM events').first();
  assert.equal(event.kind, 'scope_review');
  assert.equal(event.publication_date, '2026-09-02');
  assert.equal(JSON.parse(event.details).effectiveDate, null);
  await monitor.review(
    event.id,
    'approved',
    'Test dayanağı ve ek kontrolü',
    'Editör',
  );
  await monitor.process(await add(monitor, env, payload), 2000);
  assert.equal(
    (await env.DB.prepare('SELECT COUNT(*) AS count FROM events').first())
      .count,
    1,
  );
  assert.equal(
    (await env.DB.prepare('SELECT state FROM events').first()).state,
    'approved',
  );
  assert.equal(
    (await env.DB.prepare('SELECT COUNT(*) AS count FROM reviews').first())
      .count,
    1,
  );
  await assert.rejects(monitor.review(event.id, 'approved', '', 'Editör'));
  await assert.rejects(monitor.review(event.id, 'published', 'not', 'Editör'));
  env.sqlite.close();
});

test('index schedules all documents and same-day mükerrer, including unrecognised titles', async () => {
  const env = testStorage();
  const markup = legalHtml(
    'Resmî Gazete',
    `<a href="${source}">Genel kanun</a><a href="/fihrist?tarih=2026-09-02&amp;mukerrer=1">Mükerrer</a>`,
  );
  const monitor = new Monitor(env, [], async () => htmlResponse(markup));
  const job = await add(monitor, env, {
    kind: 'issue',
    url: 'https://www.resmigazete.gov.tr/02.09.2026',
    title: 'İndeks',
    date: '2026-09-02',
  });
  assert.equal(await monitor.process(job), true);
  const jobs = await env.DB.prepare(
    'SELECT * FROM jobs WHERE completed_at IS NULL',
  ).all();
  assert.equal(jobs.results.length, 2);
  assert.ok(
    jobs.results.some((row) => JSON.parse(row.payload).kind === 'discovery'),
  );
  env.sqlite.close();
});

test('scan seed is idempotent per cycle and fills downtime gaps without skipping dates', async () => {
  const env = testStorage();
  const monitor = new Monitor(env, catalog);
  await env.DB.prepare(
    "INSERT INTO meta(key,value) VALUES('last_enqueued_date','2026-08-01')",
  ).run();
  const now = Date.parse('2026-09-03T05:00:00Z');
  await monitor.seed(now);
  const before = await env.DB.prepare(
    'SELECT COUNT(*) AS count FROM jobs',
  ).first();
  assert.equal(
    (
      await env.DB.prepare(
        "SELECT value FROM meta WHERE key='last_enqueued_date'",
      ).first()
    ).value,
    '2026-08-08',
  );
  // A repeated seed may safely fill the next older gap, but never duplicates a URL/cycle job.
  await monitor.seed(now);
  const jobs = await env.DB.prepare('SELECT payload FROM jobs').all();
  assert.equal(
    jobs.results.filter((row) => JSON.parse(row.payload).kind === 'known')
      .length,
    1,
  );
  assert.ok(before.count < jobs.results.length);
  env.sqlite.close();
});

test('PDF is saved as evidence and is never treated as a fully checked text', async () => {
  const env = testStorage();
  const monitor = new Monitor(
    env,
    catalog,
    async () => new Response('%PDF-1.7 test'),
  );
  await monitor.process(
    await add(monitor, env, {
      kind: 'known',
      url: source,
      title: 'PDF kaynak',
    }),
  );
  assert.equal(
    (await env.DB.prepare('SELECT kind FROM events').first()).kind,
    'manual_text_review',
  );
  assert.equal(env.blobs.size, 1);
  env.sqlite.close();
});

test('new annex needs review and is linked to its parent', async () => {
  const env = testStorage();
  const monitor = new Monitor(env, [], async () =>
    htmlResponse(legalHtml('Ek 1')),
  );
  await monitor.process(
    await add(monitor, env, {
      kind: 'annex',
      url: source,
      title: 'Ek 1',
      parent: 'parent',
      depth: 1,
    }),
  );
  const event = await env.DB.prepare('SELECT * FROM events').first();
  assert.equal(event.kind, 'annex_review');
  assert.equal(JSON.parse(event.details).parent, 'parent');
  env.sqlite.close();
});
