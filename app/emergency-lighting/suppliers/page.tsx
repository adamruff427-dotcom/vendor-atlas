import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Emergency lighting testing providers', description: 'Compare source-linked UK emergency-lighting testing providers with visible evidence gaps and no paid ranking.', alternates: { canonical: '/emergency-lighting/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="emergency-lighting" /> }
