import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK fire risk assessment provider directory', description: 'Compare sourced evidence for fire risk assessment providers without paid ranking.', alternates: { canonical: '/fire-risk-assessment/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="fire-risk-assessment" /> }
