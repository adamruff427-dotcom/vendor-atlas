import { describe, expect, it } from 'vitest'
import { isFunnelEvent, sanitiseAnalyticsPayload } from '../domain/funnel'

describe('first-party funnel event boundary', () => {
  it('accepts only the documented funnel events', () => {
    expect(isFunnelEvent('assessment_started')).toBe(true)
    expect(isFunnelEvent('contact_details')).toBe(false)
    expect(isFunnelEvent(undefined)).toBe(false)
  })

  it('retains only bounded, non-contact metadata', () => {
    expect(sanitiseAnalyticsPayload({
      status: 'likely-relevant',
      supplier: 'dsear-ra',
      service: 'dsear',
      email: 'buyer@example.com',
      answers: { hazards: ['fuels'] },
    })).toEqual({
      status: 'likely-relevant',
      supplier: 'dsear-ra',
      service: 'dsear',
    })
  })
})
