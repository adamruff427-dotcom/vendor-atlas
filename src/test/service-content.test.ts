import { describe, expect, it } from 'vitest'
import { allServicePages, servicePages } from '../content/service-pages'

describe('industrial service decision content', () => {
  it('gives every vertical a landing route and four substantive buying guides', () => {
    for (const [serviceId, pages] of Object.entries(servicePages)) {
      expect(pages).toHaveLength(5)
      expect(pages[0].path).toBe(`/${serviceId}`)
      for (const page of pages) {
        expect(page.intro.length).toBeGreaterThan(150)
        expect(page.decision.summary.length).toBeGreaterThan(140)
        expect(page.decision.checks).toHaveLength(3)
        expect(page.decision.action.length).toBeGreaterThan(100)
        expect(page.sections).toHaveLength(3)
        expect(page.sources.length).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('uses unique routes and only authoritative guide sources', () => {
    expect(new Set(allServicePages.map((page) => page.path)).size).toBe(allServicePages.length)
    for (const page of allServicePages) {
      expect(new Set(page.sources.map((item) => item.url)).size).toBe(page.sources.length)
      expect(page.sources.every((item) => ['www.hse.gov.uk', 'books.hse.gov.uk', 'www.legislation.gov.uk'].includes(new URL(item.url).hostname))).toBe(true)
    }
  })
})
