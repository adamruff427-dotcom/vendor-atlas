import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Asbestos survey buying toolkit', description: 'Prepare a building and work scope, test surveyor evidence and compare asbestos-survey quotes.', alternates: { canonical: '/asbestos/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="asbestos" /> }
