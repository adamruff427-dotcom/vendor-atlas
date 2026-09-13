import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'PAT testing buying toolkit', description: 'Prepare an equipment schedule, check tester evidence and compare inspection and testing quotes.', alternates: { canonical: '/pat-testing/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="pat-testing" /> }
