import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Fire door inspection buying toolkit', description: 'Prepare a door schedule and compare inspection method, access, report limitations and total costs.', alternates: { canonical: '/fire-door-inspection/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="fire-door-inspection" /> }
