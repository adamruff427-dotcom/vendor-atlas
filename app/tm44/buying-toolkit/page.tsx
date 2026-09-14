import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'TM44 inspection buying toolkit', description: 'Prepare a plant schedule, check energy-assessor evidence and compare TM44 inspection quotes.', alternates: { canonical: '/tm44/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="tm44" /> }
