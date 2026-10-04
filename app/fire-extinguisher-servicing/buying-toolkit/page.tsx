import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Fire extinguisher servicing buying toolkit', description: 'Prepare a unit schedule and compare scope, technician evidence and total service costs.', alternates: { canonical: '/fire-extinguisher-servicing/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="fire-extinguisher-servicing" /> }
