import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Workplace noise assessment provider directory', description: 'Compare sourced evidence for workplace noise assessment providers without paid ranking.', alternates: { canonical: '/workplace-noise/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="workplace-noise" /> }
