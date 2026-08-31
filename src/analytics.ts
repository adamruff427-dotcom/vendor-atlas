import type { AnalyticsPayload, FunnelEvent } from './domain/funnel'

export type { AnalyticsPayload, FunnelEvent } from './domain/funnel'
type Adapter = (event: FunnelEvent, payload: AnalyticsPayload) => void

const adapters: Adapter[] = []
export function registerAnalyticsAdapter(adapter: Adapter) { adapters.push(adapter) }
export function track(event: FunnelEvent, payload: AnalyticsPayload = {}) {
  adapters.forEach((adapter) => adapter(event, payload))
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('vendor-atlas:analytics', { detail: { event, payload } }))
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.info('[analytics]', event, payload)
    return
  }
  void fetch('/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ event, path: location.pathname, payload }),
    keepalive: true,
  }).catch(() => undefined)
}
