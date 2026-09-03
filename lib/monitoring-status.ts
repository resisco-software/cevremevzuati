import 'server-only';

import { monitorSummaryUrl } from './monitor-url';

type MonitoringStatus = {
  state: 'unconfigured' | 'unavailable' | 'waiting' | 'running' | 'incomplete';
  lastSeedAt: number | null;
  lastCompletedAt: number | null;
  queued: number | null;
  errors: number | null;
  pending: number | null;
};

const empty: MonitoringStatus = {
  state: 'unconfigured',
  lastSeedAt: null,
  lastCompletedAt: null,
  queued: null,
  errors: null,
  pending: null,
};

const CACHE_TTL_MS = 60_000;
const ERROR_TTL_MS = 10_000;
let cached: { at: number; ttl: number; value: MonitoringStatus } | null = null;

export async function getMonitoringStatus(): Promise<MonitoringStatus> {
  if (cached && Date.now() - cached.at < cached.ttl) return cached.value;
  const service = process.env.MONITOR_SERVICE_URL;
  const token = process.env.MONITOR_STATUS_TOKEN;
  if (!service || !token) return empty;
  const url = monitorSummaryUrl(service);
  if (!url) return empty;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('İzleme servisi yanıt vermedi');
    const result = await response.json();
    if (!result || typeof result !== 'object')
      throw new Error('Eksik izleme verisi');
    const data = result as {
      queued?: unknown;
      sourceErrors?: unknown;
      pending?: unknown;
      lastRun?: { completed_at?: unknown };
      lastSeedAt?: unknown;
      enabled?: unknown;
    };
    const count = (value: unknown): number => {
      if (
        typeof value !== 'number' ||
        !Number.isSafeInteger(value) ||
        value < 0
      )
        throw new Error('Geçersiz izleme verisi');
      return value;
    };
    const queued = count(data.queued);
    const errors = count(data.sourceErrors);
    if (!Array.isArray(data.pending)) throw new Error('Eksik izleme verisi');
    const pending = data.pending.reduce(
      (sum: number, row: { count: unknown }) => sum + count(row.count),
      0,
    );
    const lastCompletedAt = data.lastRun?.completed_at
      ? count(data.lastRun.completed_at)
      : null;
    const lastSeedAt = data.lastSeedAt ? count(data.lastSeedAt) : null;
    const fresh =
      lastCompletedAt &&
      Date.now() - lastCompletedAt < 30 * 60_000 &&
      lastSeedAt &&
      Date.now() - lastSeedAt < 26 * 60 * 60_000;
    const value: MonitoringStatus = {
      state:
        data.enabled !== true
          ? 'waiting'
          : errors || !fresh
            ? 'incomplete'
            : 'running',
      lastSeedAt,
      lastCompletedAt,
      queued,
      errors,
      pending,
    };
    cached = { at: Date.now(), ttl: CACHE_TTL_MS, value };
    return value;
  } catch {
    const value = { ...empty, state: 'unavailable' as const };
    cached = { at: Date.now(), ttl: ERROR_TTL_MS, value };
    return value;
  }
}
