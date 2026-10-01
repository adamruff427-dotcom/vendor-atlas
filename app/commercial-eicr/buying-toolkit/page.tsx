import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Commercial EICR buying toolkit', description: 'Prepare a board and circuit schedule and compare fixed-wiring inspection quotes on the same terms.', alternates: { canonical: '/commercial-eicr/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="commercial-eicr" /> }
