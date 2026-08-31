import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK LOLER examination provider directory', description: 'Compare public evidence for UK LOLER thorough-examination providers without paid ranking.', alternates: { canonical: '/loler/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="loler" /> }
