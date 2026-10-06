import type { Metadata } from 'next'
import { ServiceLanding } from '../src/components/ServiceLanding'

export const metadata: Metadata = {
  title: 'UK compliance service finder',
  description: 'Choose a compliance service, check your situation and compare likely scope, planning costs and sourced specialists.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return <ServiceLanding serviceId="dsear" />
}
