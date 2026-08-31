import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'LEV testing buying toolkit', description: 'Prepare an LEV system schedule, test examiner competence and compare TExT quotations on the same scope.', alternates: { canonical: '/lev/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="lev" /> }
