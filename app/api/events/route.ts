import { getDb } from '../../../db'
import { analyticsEvents } from '../../../db/schema'
import { isProductAnalyticsEvent, sanitiseAnalyticsPayload } from '../../../src/domain/funnel'

const noStore = { 'cache-control': 'no-store' }

export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 5_000) {
    return Response.json({ error: 'Event is too large' }, { status: 413, headers: noStore })
  }

  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: noStore })
  }

  if (!isProductAnalyticsEvent(input.event)) {
    return Response.json({ error: 'Unknown event' }, { status: 422, headers: noStore })
  }

  const url = new URL(request.url)
  const suppliedPath = typeof input.path === 'string' ? input.path : '/'
  const path = suppliedPath.startsWith('/') ? suppliedPath.slice(0, 300) : url.pathname
  const payload = sanitiseAnalyticsPayload(input.payload)

  await getDb().insert(analyticsEvents).values({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    event: input.event,
    path,
    payload: JSON.stringify(payload),
  })

  return Response.json({ ok: true }, { status: 201, headers: noStore })
}
