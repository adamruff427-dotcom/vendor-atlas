import { describe, expect, it, vi } from 'vitest'
import { leadEventRow, leadLifecycleEvents, sanitiseLeadMetadata } from '../domain/lead-lifecycle'

describe('lead lifecycle audit boundary', () => {
  it('covers receipt, follow-up, supplier, quote and revenue stages', () => {
    expect(leadLifecycleEvents).toEqual(expect.arrayContaining([
      'enquiry_received',
      'buyer_acknowledgement_sent',
      'buyer_contacted',
      'supplier_accepted',
      'buyer_authorised_sharing',
      'introduction_released',
      'quote_received',
      'quote_awarded',
      'lead_fee_invoiced',
      'lead_fee_paid',
      'lead_fee_refunded',
    ]))
  })

  it('retains operational metadata but removes contact details and project answers', () => {
    expect(sanitiseLeadMetadata({
      reason: 'buyer confirmed the brief',
      commercial_band: 'standard',
      channel: 'email',
      email: 'buyer@example.com',
      phone: '01234 567890',
      answers: { sites: 3 },
    })).toEqual({
      reason: 'buyer confirmed the brief',
      commercial_band: 'standard',
      channel: 'email',
    })
  })

  it('creates an auditable money event in minor currency units', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'event-1' })
    expect(leadEventRow({
      enquiryId: 'enquiry-1',
      event: 'lead_fee_paid',
      serviceId: 'dsear',
      actorType: 'system',
      supplierId: 'supplier-1',
      amountPence: 12500,
      metadata: { commercial_band: 'standard' },
    }, new Date('2026-08-31T20:00:00.000Z'))).toEqual({
      id: 'event-1',
      enquiryId: 'enquiry-1',
      createdAt: '2026-08-31T20:00:00.000Z',
      event: 'lead_fee_paid',
      serviceId: 'dsear',
      actorType: 'system',
      supplierId: 'supplier-1',
      amountPence: 12500,
      currency: 'GBP',
      payload: '{"commercial_band":"standard"}',
    })
    vi.unstubAllGlobals()
  })

  it('drops invalid amounts instead of recording contradictory revenue', () => {
    const row = leadEventRow({
      enquiryId: 'enquiry-1',
      event: 'lead_fee_assessed',
      serviceId: 'lev',
      actorType: 'operator',
      amountPence: -1,
      currency: 'GBP',
    })
    expect(row.amountPence).toBeNull()
    expect(row.currency).toBeNull()
  })
})
