import type { Metadata } from 'next'
import { ServiceSupplierDirectory } from '../../../src/components/ServiceSupplierDirectory'
export const metadata: Metadata = { title: 'Hand-arm vibration assessment provider directory', description: 'Compare source-linked evidence for UK hand-arm vibration assessment providers without paid ranking.', alternates: { canonical: '/hand-arm-vibration/suppliers' } }
export default function Page() { return <ServiceSupplierDirectory serviceId="hand-arm-vibration" /> }
