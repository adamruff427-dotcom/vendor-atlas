'use client'

import type { ReactNode } from 'react'
import { track } from '../analytics'

export function TrackedSupplierLink({ href, supplierId, children, className }: { href: string; supplierId: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" onClick={() => track('supplier_viewed', { supplier: supplierId })}>{children}</a>
}
