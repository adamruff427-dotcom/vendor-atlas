import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'PSSR written-scheme buying toolkit', description: 'Prepare a pressure-system inventory, test competent-person evidence and compare written-scheme and examination quotes.', alternates: { canonical: '/pressure-systems/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="pressure-systems" /> }
