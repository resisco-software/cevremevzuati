import vinext from 'vinext';
import { defineConfig } from 'vite';

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';
const useNitro =
  process.env.VERCEL === '1' || process.env.NITRO_PRESET === 'vercel';

const shared = {
  environments: {
    client: {
      optimizeDeps: {
        include: ['next/link'],
      },
    },
  },
  server: isCodexSeatbeltSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
};

export default defineConfig(async () => {
  if (useNitro) {
    const { nitro } = await import('nitro/vite');
    return {
      ...shared,
      plugins: [
        vinext(),
        nitro({
          vercel: {
            functions: { runtime: 'nodejs22.x' },
          },
        }),
      ],
    };
  }

  const { sites } = await import('@openai/sites-vite-plugin');
  const mod = await import('./.openai/hosting.json');
  const hostingConfig = (
    'default' in mod && mod.default ? mod.default : mod
  ) as { d1: string | null; r2: string | null };
  const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
    '00000000-0000-4000-8000-000000000000';
  const { d1, r2 } = hostingConfig;

  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    ...shared,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          main: 'vinext/server/fetch-handler',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: d1
            ? [
                {
                  binding: d1,
                  database_name: 'site-creator-d1',
                  database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
                },
              ]
            : [],
          r2_buckets: r2
            ? [
                {
                  binding: r2,
                  bucket_name: 'site-creator-r2',
                },
              ]
            : [],
        },
      }),
    ],
  };
});
