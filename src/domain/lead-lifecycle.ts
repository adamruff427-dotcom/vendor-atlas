import type { ServiceId } from './types'

export const leadLifecycleEvents = [
  'enquiry_received',
  'enquiry_duplicate',
  'enquiry_validated',
  'enquiry_rejected',
  'buyer_acknowledgement_due',
  'buyer_acknowledgement_sent',
  'buyer_contacted',
  'buyer_authorised_sharing',
  'supplier_invited',
  'supplier_accepted',
  'supplier_declined',
  'introduction_released',
  'quote_received',
  'quote_awarded',
  'lead_fee_assessed',
  'lead_fee_invoiced',
  'lead_fee_paid',
  'lead_fee_refunded',
  'enquiry_closed',
] as const

export type LeadLifecycleEvent = (typeof leadLifecycleEvents)[number]
export type LeadActor = 'system' | 'operator' | 'buyer' | 'supplier'

export interface LeadEventInput {
  enquiryId: string
  event: LeadLifecycleEvent
  serviceId: ServiceId
  actorType: LeadActor
  supplierId?: string
  amountPence?: number
  currency?: 'GBP'
  metadata?: Record<string, unknown>
}

const allowedMetadataKeys = new Set(['reason', 'commercial_band', 'status', 'channel'])

export function sanitiseLeadMetadata(value: unknown): Record<string, string | number | boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, item]) => allowedMetadataKeys.has(key) && ['string', 'number', 'boolean'].includes(typeof item))
      .map(([key, item]) => [key, typeof item === 'string' ? item.slice(0, 80) : item]),
  ) as Record<string, string | number | boolean>
}

export function leadEventRow(input: LeadEventInput, now = new Date()) {
  const amountPence = Number.isInteger(input.amountPence) && (input.amountPence ?? 0) >= 0
    ? input.amountPence ?? null
    : null
  return {
    id: crypto.randomUUID(),
    enquiryId: input.enquiryId,
    createdAt: now.toISOString(),
    event: input.event,
    serviceId: input.serviceId,
    actorType: input.actorType,
    supplierId: input.supplierId?.slice(0, 80) || null,
    amountPence,
    currency: amountPence === null ? null : input.currency ?? 'GBP',
    payload: JSON.stringify(sanitiseLeadMetadata(input.metadata)),
  }
}
