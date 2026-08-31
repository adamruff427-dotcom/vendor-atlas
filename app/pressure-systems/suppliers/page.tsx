import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK PSSR and pressure-system provider directory', description: 'Compare public evidence for UK written-scheme and pressure-system examination providers without paid ranking.', alternates: { canonical: '/pressure-systems/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="pressure-systems" /> }
