import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK legionella risk assessment provider directory', description: 'Compare sourced evidence for UK legionella risk assessment providers without paid ranking.', alternates: { canonical: '/legionella/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="legionella" /> }
