'use client'

import type { ReactNode } from 'react'
import { track } from '../analytics'
import type { ServiceId } from '../domain/types'

export function TrackedSupplierLink({ href, supplierId, serviceId = 'dsear', children, className }: { href: string; supplierId: string; serviceId?: ServiceId; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" onClick={() => track('supplier_viewed', { supplier: supplierId, service: serviceId })}>{children}</a>
}
