import { sites } from '@openai/sites-vite-plugin'
import vinext from 'vinext'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import hostingConfig from './.openai/hosting.json' with { type: 'json' }

const { d1, r2 } = hostingConfig
const placeholderDatabaseId = '00000000-0000-4000-8000-000000000000'

export default defineConfig(async ({ mode }) => {
  if (mode === 'test') return { plugins: [react()], test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' } }
  process.env.WRANGLER_WRITE_LOGS ??= 'false'
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs'
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry'
  const { cloudflare } = await import('@cloudflare/vite-plugin')
  return {
    plugins: [
      vinext(), sites(),
      cloudflare({ viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] }, config: {
        main: 'vinext/server/fetch-handler', compatibility_flags: ['nodejs_compat'],
        d1_databases: d1 ? [{ binding: d1, database_name: 'vendor-atlas-local', database_id: placeholderDatabaseId }] : [],
        r2_buckets: r2 ? [{ binding: r2, bucket_name: 'vendor-atlas-r2' }] : [],
      }}),
    ],
  }
})
