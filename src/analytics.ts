export type FunnelEvent = 'landing_page_view' | 'assessment_started' | 'assessment_completed' | 'results_viewed' | 'supplier_viewed' | 'quote_request_started' | 'quote_request_completed'
export type AnalyticsPayload = Record<string, string | number | boolean>
type Adapter = (event: FunnelEvent, payload: AnalyticsPayload) => void

const adapters: Adapter[] = []
export function registerAnalyticsAdapter(adapter: Adapter) { adapters.push(adapter) }
export function track(event: FunnelEvent, payload: AnalyticsPayload = {}) {
  adapters.forEach((adapter) => adapter(event, payload))
  window.dispatchEvent(new CustomEvent('vendor-atlas:analytics', { detail: { event, payload } }))
  if (typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)) console.info('[analytics]', event, payload)
}
