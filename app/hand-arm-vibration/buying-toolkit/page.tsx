import type { Metadata } from 'next'
import { ServiceBuyingToolkit } from '../../../src/components/ServiceBuyingToolkit'
export const metadata: Metadata = { title: 'Hand-arm vibration assessment buying toolkit', description: 'Prepare a tool and trigger-time brief and compare vibration risk assessment quotes.', alternates: { canonical: '/hand-arm-vibration/buying-toolkit' } }
export default function Page() { return <ServiceBuyingToolkit serviceId="hand-arm-vibration" /> }
