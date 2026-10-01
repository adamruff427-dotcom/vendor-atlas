import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Commercial EICR provider directory', description: 'Compare source-linked UK fixed-wiring inspection providers with visible evidence gaps and no paid ranking.', alternates: { canonical: '/commercial-eicr/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="commercial-eicr" /> }
