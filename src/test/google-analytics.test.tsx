import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GoogleAnalytics } from '../components/GoogleAnalytics'

const selector = 'script[data-vendor-atlas-ga="G-R0FM31KWS7"]'
const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.querySelector(selector)?.remove()
  window.gtag = undefined
  window.dataLayer = undefined
})

describe('Google Analytics consent boundary', () => {
  it('does not insert the Google tag before permission and loads it after permission', async () => {
    const user = userEvent.setup()
    render(<GoogleAnalytics />)
    expect(await screen.findByRole('heading', { name: /help us measure/i })).toBeInTheDocument()
    expect(document.querySelector(selector)).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Allow Google Analytics' }))
    expect(document.querySelector(selector)).not.toBeNull()
    expect(localStorage.getItem('vendor-atlas:analytics-consent')).toBe('granted')
  })

  it('keeps the Google tag absent when permission is declined', async () => {
    const user = userEvent.setup()
    render(<GoogleAnalytics />)
    await user.click(await screen.findByRole('button', { name: 'Continue without Google Analytics' }))
    expect(document.querySelector(selector)).toBeNull()
    expect(localStorage.getItem('vendor-atlas:analytics-consent')).toBe('denied')
  })
})
