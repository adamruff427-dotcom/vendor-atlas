import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Fire door inspection providers', description: 'Compare source-linked provider scope, geographical coverage and evidence gaps.', alternates: { canonical: '/fire-door-inspection/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="fire-door-inspection" /> }
