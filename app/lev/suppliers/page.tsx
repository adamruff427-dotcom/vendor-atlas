import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK LEV testing provider directory', description: 'Compare public evidence for UK LEV thorough-examination providers without paid ranking.', alternates: { canonical: '/lev/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="lev" /> }
