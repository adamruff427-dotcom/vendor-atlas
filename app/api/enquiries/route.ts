import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { enquiries } from '../../../db/schema'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const serviceIds = new Set(['dsear', 'lev', 'pressure-systems', 'loler'])
const noStore = { 'cache-control': 'no-store' }
function text(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }

export async function POST(request: Request) {
  let input: Record<string, unknown>
  try { input = await request.json() as Record<string, unknown> } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: noStore }) }
  if (text(input.website, 200)) return Response.json({ ok: true }, { headers: noStore })
  const id = text(input.id, 80), companyName = text(input.companyName, 120), contactName = text(input.contactName, 120), businessEmail = text(input.businessEmail, 200).toLowerCase(), phone = text(input.phone, 40)
  const serviceId = text(input.serviceId, 40)
  if (!id || !companyName || !contactName || !emailPattern.test(businessEmail) || input.consent !== true || !serviceIds.has(serviceId)) return Response.json({ error: 'Required enquiry fields are invalid' }, { status: 422, headers: noStore })
  if (JSON.stringify(input).length > 50_000) return Response.json({ error: 'Enquiry is too large' }, { status: 413, headers: noStore })
  const db = getDb()
  const existing = await db.select({ id: enquiries.id }).from(enquiries).where(eq(enquiries.id, id)).limit(1)
  if (existing.length) return Response.json({ ok: true, id }, { headers: noStore })
  await db.insert(enquiries).values({ id, createdAt: new Date().toISOString(), serviceId, companyName, contactName, businessEmail, phone: phone || null, consent: true, payload: JSON.stringify(input), status: 'received' })
  return Response.json({ ok: true, id }, { status: 201, headers: noStore })
}
