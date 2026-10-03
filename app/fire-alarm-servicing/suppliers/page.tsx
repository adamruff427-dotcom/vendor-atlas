import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Fire alarm servicing providers', description: 'Compare source-linked UK fire-alarm servicing providers, evidence gaps and required capabilities.', alternates: { canonical: '/fire-alarm-servicing/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="fire-alarm-servicing" /> }
