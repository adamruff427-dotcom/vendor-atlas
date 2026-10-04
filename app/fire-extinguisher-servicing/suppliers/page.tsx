import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Fire extinguisher servicing providers', description: 'Compare source-linked UK providers and evidence gaps before appointment.', alternates: { canonical: '/fire-extinguisher-servicing/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="fire-extinguisher-servicing" /> }
