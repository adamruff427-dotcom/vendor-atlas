import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Legionella risk assessment buying toolkit', description: 'Prepare a water-system schedule, check assessor evidence and compare legionella risk assessment quotes.', alternates: { canonical: '/legionella/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="legionella" /> }
