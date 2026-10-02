import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Emergency lighting testing buying toolkit', description: 'Prepare a fitting schedule and compare emergency-lighting testing quotes on equal terms.', alternates: { canonical: '/emergency-lighting/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="emergency-lighting" /> }
