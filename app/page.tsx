import type { Metadata } from 'next'
import { ServiceLanding } from '../src/components/ServiceLanding'

export const metadata: Metadata = {
  title: 'UK compliance service finder',
  description: 'Choose a UK compliance service, check your situation and compare likely scope, sourced cost evidence and specialists, including DSEAR, kitchen extract cleaning and workplace first-aid training.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return <ServiceLanding serviceId="dsear" />
}
