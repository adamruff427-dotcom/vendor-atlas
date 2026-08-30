import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { enquiries } from '../../../db/schema'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function text(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }

export async function POST(request: Request) {
  let input: Record<string, unknown>
  try { input = await request.json() as Record<string, unknown> } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (text(input.website, 200)) return Response.json({ ok: true })
  const id = text(input.id, 80), createdAt = text(input.createdAt, 40), companyName = text(input.companyName, 120), contactName = text(input.contactName, 120), businessEmail = text(input.businessEmail, 200).toLowerCase(), phone = text(input.phone, 40)
  if (!id || !createdAt || !companyName || !contactName || !emailPattern.test(businessEmail) || input.consent !== true || input.serviceId !== 'dsear') return Response.json({ error: 'Required enquiry fields are invalid' }, { status: 422 })
  if (JSON.stringify(input).length > 50_000) return Response.json({ error: 'Enquiry is too large' }, { status: 413 })
  const db = getDb()
  const existing = await db.select({ id: enquiries.id }).from(enquiries).where(eq(enquiries.id, id)).limit(1)
  if (existing.length) return Response.json({ ok: true, id })
  await db.insert(enquiries).values({ id, createdAt, serviceId: 'dsear', companyName, contactName, businessEmail, phone: phone || null, consent: true, payload: JSON.stringify(input), status: 'received' })
  return Response.json({ ok: true, id }, { status: 201 })
}
