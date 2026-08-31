import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'LOLER examination buying toolkit', description: 'Prepare a lifting-equipment asset schedule, test competence and compare thorough-examination quotes.', alternates: { canonical: '/loler/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="loler" /> }
