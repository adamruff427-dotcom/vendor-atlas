import { describe, expect, it } from 'vitest'
import { analyticsServiceForPath, isFunnelEvent, isProductAnalyticsEvent, sanitiseAnalyticsPayload } from '../domain/funnel'

describe('first-party funnel event boundary', () => {
  it('accepts only the documented funnel events', () => {
    expect(isFunnelEvent('assessment_started')).toBe(true)
    expect(isFunnelEvent('quote_request_failed')).toBe(true)
    expect(isFunnelEvent('contact_details')).toBe(false)
    expect(isFunnelEvent(undefined)).toBe(false)
  })

  it('accepts privacy-safe page views without treating them as funnel conversions', () => {
    expect(isProductAnalyticsEvent('page_view')).toBe(true)
    expect(isFunnelEvent('page_view')).toBe(false)
  })

  it('classifies all public service paths without collecting the URL contents as metadata', () => {
    expect(analyticsServiceForPath('/')).toBe('dsear')
    expect(analyticsServiceForPath('/dsear/cost')).toBe('dsear')
    expect(analyticsServiceForPath('/lev/suppliers')).toBe('lev')
    expect(analyticsServiceForPath('/pressure-systems')).toBe('pressure-systems')
    expect(analyticsServiceForPath('/loler/cost')).toBe('loler')
    expect(analyticsServiceForPath('/privacy')).toBe('site')
  })

  it('retains only bounded, non-contact metadata', () => {
    expect(sanitiseAnalyticsPayload({
      status: 'likely-relevant',
      supplier: 'dsear-ra',
      service: 'dsear',
      page_type: 'landing',
      email: 'buyer@example.com',
      answers: { hazards: ['fuels'] },
    })).toEqual({
      status: 'likely-relevant',
      supplier: 'dsear-ra',
      service: 'dsear',
      page_type: 'landing',
    })
  })
})
