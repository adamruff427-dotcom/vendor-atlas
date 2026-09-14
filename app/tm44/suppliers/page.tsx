import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'TM44 air-conditioning inspection provider directory', description: 'Compare sourced evidence for TM44 inspection providers without paid ranking.', alternates: { canonical: '/tm44/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="tm44" /> }
