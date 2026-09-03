import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/worker.js';
import { testStorage } from './helpers.mjs';

const testToken = 'integration-test-only-not-a-real-secret-123456';
const origin = 'https://monitor.example.test';

test('unconfigured and unauthenticated monitor never exposes review data', async () => {
  assert.equal(
    (await worker.fetch(new Request(`${origin}/admin`), {})).status,
    503,
  );
  const env = { ...testStorage(), ADMIN_TOKEN: testToken };
  assert.equal(
    (await worker.fetch(new Request(`${origin}/api/summary`), env)).status,
    401,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request(`${origin}/api/export`, {
          headers: { Authorization: 'Bearer wrong' },
        }),
        env,
      )
    ).status,
    401,
  );
  const health = await worker.fetch(new Request(`${origin}/health`), env);
  assert.deepEqual(await health.json(), {
    configured: false,
    status: 'configuration-only',
  });
  env.sqlite.close();
});

test('login uses secure HttpOnly session cookie and rejects foreign-origin writes', async () => {
  const env = { ...testStorage(), ADMIN_TOKEN: testToken };
  const response = await worker.fetch(
    new Request(`${origin}/login`, {
      method: 'POST',
      headers: { Origin: origin },
      body: new URLSearchParams({ token: testToken }),
    }),
    env,
  );
  assert.equal(response.status, 303);
  const cookie = response.headers.get('Set-Cookie');
  assert.match(
    cookie,
    /__Host-monitor_admin=.+; Path=\/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600/,
  );
  const blocked = await worker.fetch(
    new Request(`${origin}/review`, {
      method: 'POST',
      headers: { Origin: 'https://evil.test', Cookie: cookie },
    }),
    env,
  );
  assert.equal(blocked.status, 403);
  const summary = await worker.fetch(
    new Request(`${origin}/api/summary`, { headers: { Cookie: cookie } }),
    env,
  );
  assert.equal(summary.status, 200);
  assert.equal((await summary.json()).automaticLegalVerification, false);
  env.sqlite.close();
});

test('candidate HTML is escaped, decisions are audited and catalog is never published', async () => {
  const env = { ...testStorage(), ADMIN_TOKEN: testToken };
  await env.DB.prepare(
    'INSERT INTO events(id,kind,url,title,details,created_at) VALUES(?,?,?,?,?,?)',
  )
    .bind(
      'test-record',
      'scope_review',
      'https://www.resmigazete.gov.tr/',
      '<script>alert(1)</script>',
      '{"excerpt":"<img src=x onerror=alert(1)>"}',
      1000,
    )
    .run();
  const headers = { Authorization: `Bearer ${testToken}` };
  const admin = await worker.fetch(
    new Request(`${origin}/admin`, { headers }),
    env,
  );
  const body = await admin.text();
  assert.ok(body.includes('&lt;script&gt;'));
  assert.ok(!body.includes('<script>'));
  const response = await worker.fetch(
    new Request(`${origin}/review`, {
      method: 'POST',
      headers: { ...headers, Origin: origin },
      body: new URLSearchParams({
        id: 'test-record',
        decision: 'approved',
        reviewer: 'Test editörü',
        note: 'Test dayanağı',
      }),
    }),
    env,
  );
  assert.equal(response.status, 303);
  const exported = await worker.fetch(
    new Request(`${origin}/api/export`, { headers }),
    env,
  );
  const data = await exported.json();
  assert.equal(data.events[0].state, 'approved');
  assert.equal(data.reviews.length, 1);
  assert.equal(data.publishesCatalog, false);
  assert.equal(data.next, null);
  env.sqlite.close();
});

test('disabled scheduled handler does not fetch sources or touch storage', async () => {
  await worker.scheduled(
    { cron: '0 5,15 * * *' },
    { MONITOR_ENABLED: 'false' },
  );
  await worker.scheduled(
    { cron: '0 5,15 * * *' },
    { MONITOR_ENABLED: 'true', SOURCE_VALIDATED: 'false' },
  );
  await worker.scheduled(
    { cron: '0 5,15 * * *' },
    { MONITOR_ENABLED: 'true', SOURCE_VALIDATED: 'true' },
  );
});

test('site status token cannot read candidates or submit decisions', async () => {
  const statusToken = 'test-read-only-token-not-a-real-secret-9876';
  const env = {
    ...testStorage(),
    ADMIN_TOKEN: testToken,
    STATUS_TOKEN: statusToken,
  };
  const headers = { Authorization: `Bearer ${statusToken}` };
  assert.equal(
    (await worker.fetch(new Request(`${origin}/api/summary`, { headers }), env))
      .status,
    200,
  );
  assert.equal(
    (await worker.fetch(new Request(`${origin}/api/export`, { headers }), env))
      .status,
    401,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request(`${origin}/review`, {
          method: 'POST',
          headers: { ...headers, Origin: origin },
        }),
        env,
      )
    ).status,
    401,
  );
  env.sqlite.close();
});

test('login rejects oversized streamed forms without relying on content length', async () => {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode('token=' + 'x'.repeat(17000)),
      );
      controller.close();
    },
  });
  const response = await worker.fetch(
    new Request(`${origin}/login`, {
      method: 'POST',
      headers: { Origin: origin },
      body,
      duplex: 'half',
    }),
    { ADMIN_TOKEN: testToken },
  );
  assert.equal(response.status, 413);
});
