import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Fire alarm servicing buying toolkit', description: 'Prepare a panel and device schedule and compare fire-alarm service quotes on equal terms.', alternates: { canonical: '/fire-alarm-servicing/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="fire-alarm-servicing" /> }
