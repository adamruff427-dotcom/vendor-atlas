import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'UK asbestos survey provider directory', description: 'Compare public evidence for UK asbestos-survey providers without paid ranking.', alternates: { canonical: '/asbestos/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="asbestos" /> }
