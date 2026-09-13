import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK PAT testing provider directory', description: 'Compare sourced evidence for UK portable appliance testing providers without paid ranking.', alternates: { canonical: '/pat-testing/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="pat-testing" /> }
