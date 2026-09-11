import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Fire risk assessment buying toolkit', description: 'Prepare a premises schedule, check assessor evidence and compare fire risk assessment quotes.', alternates: { canonical: '/fire-risk-assessment/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="fire-risk-assessment" /> }
