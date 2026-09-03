import { legislation } from '../../lib/legislation-data';
import { dashboard, loginPage, page } from './admin.mjs';
import { digest } from './core.mjs';
import { Monitor } from './service.mjs';

interface Env {
  DB: D1Database;
  EVIDENCE: R2Bucket;
  ADMIN_TOKEN?: string;
  STATUS_TOKEN?: string;
  MONITOR_ENABLED?: string;
  SOURCE_VALIDATED?: string;
}

const ADMIN_COOKIE = '__Host-monitor_admin';

const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};

function adminSessionCookie(value: string, maxAge: number) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function timingSafeEqual(left: string, right: string) {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  });
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
const enabled = (env: Env) =>
  env.MONITOR_ENABLED === 'true' && env.SOURCE_VALIDATED === 'true';

async function validToken(value: string, expected?: string) {
  if (
    !expected ||
    expected.length < 32 ||
    !value ||
    value.length > 512
  )
    return false;
  return timingSafeEqual(await digest(value), await digest(expected));
}

async function readForm(request: Request): Promise<URLSearchParams | null> {
  const reader = request.body?.getReader();
  if (!reader) return new URLSearchParams();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16000) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new URLSearchParams(new TextDecoder().decode(bytes));
}

const worker = {
  async scheduled(controller: ScheduledController, env: Env) {
    if (!enabled(env) || !env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32)
      return;
    const monitor = new Monitor(env, legislation);
    if (controller.cron === '0 5,15 * * *')
      await monitor.seed(controller.scheduledTime);
    await monitor.drain();
    // No periodic "unchanged" notifications; actionable records live in the inbox.
  },
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET')
      return json({ configured: enabled(env), status: 'configuration-only' });
    if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32)
      return html(
        page(
          '<h1>İzleme kurulumu bekliyor</h1><p>Yönetici erişimi yapılandırılmadan inceleme verileri açılmaz.</p>',
        ),
        503,
      );
    if (
      request.method !== 'GET' &&
      request.headers.get('origin') !== url.origin
    )
      return json({ error: 'Geçersiz istek kaynağı' }, 403);
    if (
      request.method === 'POST' &&
      Number(request.headers.get('content-length')) > 16000
    )
      return json({ error: 'İstek çok büyük' }, 413);
    if (url.pathname === '/login' && request.method === 'POST') {
      const data = await readForm(request);
      if (!data) return json({ error: 'İstek çok büyük' }, 413);
      const token = data.get('token') ?? '';
      if (!(await validToken(token, env.ADMIN_TOKEN)))
        return html(loginPage('Erişim anahtarı geçersiz.'), 401);
      return new Response(null, {
        status: 303,
        headers: {
          ...headers,
          Location: '/admin',
          'Set-Cookie': adminSessionCookie(token, 3600),
        },
      });
    }
    const bearer =
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (
      url.pathname === '/api/summary' &&
      request.method === 'GET' &&
      (await validToken(bearer, env.STATUS_TOKEN))
    ) {
      return json({
        enabled: enabled(env),
        ...(await new Monitor(env, legislation).summary()),
      });
    }
    let cookie = '';
    try {
      cookie = decodeURIComponent(
        new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`).exec(
          request.headers.get('cookie') ?? '',
        )?.[1] ?? '',
      );
    } catch {
      /* invalid cookie is unauthenticated */
    }
    if (!(await validToken(bearer || cookie, env.ADMIN_TOKEN)))
      return url.pathname.startsWith('/api/')
        ? json({ error: 'Yetki gerekli' }, 401)
        : html(loginPage(), 401);
    const monitor = new Monitor(env, legislation);
    if (url.pathname === '/logout' && request.method === 'POST')
      return new Response(null, {
        status: 303,
        headers: {
          ...headers,
          Location: '/admin',
          'Set-Cookie': adminSessionCookie('', 0),
        },
      });
    if (url.pathname === '/review' && request.method === 'POST') {
      const form = await readForm(request);
      if (!form) return json({ error: 'İstek çok büyük' }, 413);
      try {
        await monitor.review(
          form.get('id') ?? '',
          form.get('decision') ?? '',
          form.get('note') ?? '',
          form.get('reviewer') ?? '',
        );
        return new Response(null, {
          status: 303,
          headers: { ...headers, Location: '/admin' },
        });
      } catch {
        return html(
          page(
            '<h1>Karar kaydedilemedi</h1><p>Kayıt, karar, inceleyen ve dayanak alanlarını kontrol edin.</p><a href="/admin">Kuyruğa dön</a>',
          ),
          400,
        );
      }
    }
    if (request.method !== 'GET')
      return json({ error: 'Yöntem desteklenmiyor' }, 405);
    if (url.pathname === '/api/summary')
      return json({ enabled: enabled(env), ...(await monitor.summary()) });
    if (url.pathname === '/api/export') {
      // Paginated export never silently truncates the audit history.
      const offset = Math.max(
        0,
        Math.floor(Number(url.searchParams.get('offset')) || 0),
      );
      if (!Number.isSafeInteger(offset))
        return json({ error: 'Geçersiz sayfa' }, 400);
      const events = await env.DB.prepare(
        'SELECT * FROM events ORDER BY created_at,id LIMIT 50 OFFSET ?',
      )
        .bind(offset)
        .all();
      const ids = events.results.map((row) => String(row.id));
      const reviews = ids.length
        ? await env.DB.prepare(
            `SELECT * FROM reviews WHERE event_id IN (${ids.map(() => '?').join(',')})`,
          )
            .bind(...ids)
            .all()
        : { results: [] };
      return json({
        events: events.results,
        reviews: reviews.results,
        next:
          events.results.length === 50
            ? `/api/export?offset=${offset + 50}`
            : null,
        publishesCatalog: false,
      });
    }
    const evidence = /^\/api\/evidence\/([a-f0-9]{64})$/.exec(url.pathname);
    if (evidence) {
      const snapshot = await env.DB.prepare(
        'SELECT object_key,content_type FROM snapshots WHERE id=?',
      )
        .bind(evidence[1])
        .first<{ object_key: string; content_type: string }>();
      if (!snapshot) return json({ error: 'Kaynak kopyası yok' }, 404);
      const object = await env.EVIDENCE.get(snapshot.object_key);
      if (!object) return json({ error: 'Kaynak kopyası alınamadı' }, 503);
      return new Response(object.body, {
        headers: {
          ...headers,
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="kaynak-${evidence[1].slice(0, 12)}.${snapshot.content_type.includes('pdf') ? 'pdf' : 'html'}"`,
        },
      });
    }
    if (['/', '/admin'].includes(url.pathname)) {
      const events = await env.DB.prepare(
        "SELECT * FROM events WHERE state='pending' ORDER BY created_at,id LIMIT 100",
      ).all();
      return html(
        dashboard(await monitor.summary(), events.results, enabled(env)),
      );
    }
    return json({ error: 'Bulunamadı' }, 404);
  },
};

export default worker;
