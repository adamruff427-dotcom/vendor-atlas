export const funnelEvents = [
  'landing_page_view',
  'assessment_started',
  'assessment_completed',
  'results_viewed',
  'supplier_viewed',
  'quote_request_started',
  'quote_request_completed',
  'quote_request_failed',
] as const

export type FunnelEvent = (typeof funnelEvents)[number]
export const productAnalyticsEvents = ['page_view', ...funnelEvents] as const
export type ProductAnalyticsEvent = (typeof productAnalyticsEvents)[number]
export type AnalyticsPayload = Record<string, string | number | boolean>

const allowedPayloadKeys = new Set(['service', 'status', 'supplier', 'page_type'])

export function isFunnelEvent(value: unknown): value is FunnelEvent {
  return typeof value === 'string' && funnelEvents.includes(value as FunnelEvent)
}

export function isProductAnalyticsEvent(value: unknown): value is ProductAnalyticsEvent {
  return typeof value === 'string' && productAnalyticsEvents.includes(value as ProductAnalyticsEvent)
}

export function analyticsServiceForPath(path: string) {
  if (path === '/' || path.startsWith('/dsear')) return 'dsear'
  if (path.startsWith('/lev')) return 'lev'
  if (path.startsWith('/pressure-systems')) return 'pressure-systems'
  if (path.startsWith('/loler')) return 'loler'
  return 'site'
}

export function sanitiseAnalyticsPayload(value: unknown): AnalyticsPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, item]) => allowedPayloadKeys.has(key) && ['string', 'number', 'boolean'].includes(typeof item))
      .map(([key, item]) => [key, typeof item === 'string' ? item.slice(0, 80) : item]),
  ) as AnalyticsPayload
}
