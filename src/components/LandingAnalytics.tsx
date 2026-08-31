'use client'
import { useEffect } from 'react'
import { track } from '../analytics'
export function LandingAnalytics({ service = 'dsear' }: { service?: string }) { useEffect(() => track('landing_page_view', { service }), [service]); return null }
