import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Workplace noise assessment buying toolkit', description: 'Prepare a task and exposure brief, check assessor evidence and compare workplace noise assessment quotes.', alternates: { canonical: '/workplace-noise/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="workplace-noise" /> }
