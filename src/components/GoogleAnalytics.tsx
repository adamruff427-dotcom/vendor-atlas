'use client'

import { useEffect, useState } from 'react'

const MEASUREMENT_ID = 'G-R0FM31KWS7'
const CONSENT_KEY = 'vendor-atlas:analytics-consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

type Consent = 'granted' | 'denied' | null

function loadGoogleAnalytics() {
  if (document.querySelector(`script[data-vendor-atlas-ga="${MEASUREMENT_ID}"]`)) return
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  window.gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  script.dataset.vendorAtlasGa = MEASUREMENT_ID
  script.onload = () => {
    window.gtag?.('js', new Date())
    window.gtag?.('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false,
    })
  }
  document.head.appendChild(script)
}

export function GoogleAnalytics() {
  const [pathname, setPathname] = useState('')
  const [consent, setConsent] = useState<Consent>(null)
  const [isChoosing, setIsChoosing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    const current = stored === 'granted' || stored === 'denied' ? stored : null
    setConsent(current)
    setIsChoosing(current === null)
    if (current === 'granted') loadGoogleAnalytics()
    const manage = () => setIsChoosing(true)
    window.addEventListener('vendor-atlas:manage-analytics', manage)
    return () => window.removeEventListener('vendor-atlas:manage-analytics', manage)
  }, [])

  useEffect(() => {
    const updatePathname = () => setPathname(location.pathname)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    history.pushState = (...args) => { originalPushState.apply(history, args); updatePathname() }
    history.replaceState = (...args) => { originalReplaceState.apply(history, args); updatePathname() }
    window.addEventListener('popstate', updatePathname)
    updatePathname()
    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', updatePathname)
    }
  }, [])

  useEffect(() => {
    if (consent !== 'granted' || !pathname) return
    loadGoogleAnalytics()
    window.gtag?.('event', 'page_view', {
      page_location: location.href,
      page_path: pathname,
      page_title: document.title,
    })
    if (pathname === '/') window.gtag?.('event', 'landing_page_view', { service: 'dsear' })
  }, [consent, pathname])

  const choose = (next: Exclude<Consent, null>) => {
    localStorage.setItem(CONSENT_KEY, next)
    setConsent(next)
    setIsChoosing(false)
    if (next === 'granted') loadGoogleAnalytics()
    if (next === 'denied') {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
      document.querySelector(`script[data-vendor-atlas-ga="${MEASUREMENT_ID}"]`)?.remove()
      window.gtag = undefined
      window.dataLayer = undefined
      for (const name of ['_ga', `_ga_${MEASUREMENT_ID.replace('G-', '')}`]) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.artificiallyconfident.com; SameSite=Lax`
      }
    }
  }

  if (!isChoosing) return null
  return (
    <section className="analytics-consent" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-heading">
      <div>
        <span className="eyebrow">Analytics choice</span>
        <h2 id="analytics-consent-heading">Help us measure whether this is useful?</h2>
        <p>Vendor Atlas always counts a small set of anonymous funnel steps on its own server. With your permission, Google Analytics will also measure visits, traffic sources and the same non-contact funnel events. We do not send questionnaire answers, names, email addresses or phone numbers to Google, and advertising storage stays off.</p>
        <a href="/privacy">Read the privacy and analytics notice</a>
      </div>
      <div className="analytics-consent-actions">
        <button className="button primary" type="button" onClick={() => choose('granted')}>Allow Google Analytics</button>
        <button className="button secondary" type="button" onClick={() => choose('denied')}>{consent === 'granted' ? 'Withdraw permission' : 'Continue without Google Analytics'}</button>
      </div>
    </section>
  )
}

export function AnalyticsSettingsButton() {
  return <button className="link-button" type="button" onClick={() => window.dispatchEvent(new Event('vendor-atlas:manage-analytics'))}>Analytics choices</button>
}
