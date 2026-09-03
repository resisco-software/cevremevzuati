import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';

export function testStorage() {
  const sqlite = new DatabaseSync(':memory:');
  for (const file of readdirSync(new URL('../drizzle/', import.meta.url))
    .filter((file) => file.endsWith('.sql'))
    .sort()) {
    sqlite.exec(
      readFileSync(new URL(`../drizzle/${file}`, import.meta.url), 'utf8'),
    );
  }
  const query = (sql, values = []) => ({
    bind: (...values) => query(sql, values),
    async first() {
      return sqlite.prepare(sql).get(...values) ?? null;
    },
    async all() {
      return { results: sqlite.prepare(sql).all(...values) };
    },
    async run() {
      const result = sqlite.prepare(sql).run(...values);
      return { meta: { changes: Number(result.changes) } };
    },
  });
  const DB = {
    prepare: query,
    async batch(statements) {
      sqlite.exec('BEGIN');
      try {
        const result = [];
        for (const item of statements) result.push(await item.run());
        sqlite.exec('COMMIT');
        return result;
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  const blobs = new Map();
  return {
    DB,
    EVIDENCE: {
      async put(key, bytes) {
        blobs.set(key, bytes);
      },
    },
    sqlite,
    blobs,
  };
}

export const source =
  'https://www.resmigazete.gov.tr/eskiler/2026/09/20260902-1.htm';
export const catalog = [
  {
    slug: 'cevre',
    title: 'Çevre İzin ve Lisans Yönetmeliği',
    aliases: [],
    sourceUrl: source,
  },
];
export function legalHtml(
  text = 'Çevre İzin ve Lisans Yönetmeliği',
  extra = '',
) {
  return `<html lang="tr"><head><meta charset="utf-8"></head><body><h1>${text}</h1><p>MADDE 1 – Bu test metni yalnızca yazılımın kaynak izleme davranışını sınamak için oluşturulmuştur. Gerçek mevzuat değildir.</p>${extra}</body></html>`;
}
export const htmlResponse = (text) =>
  new Response(text, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
