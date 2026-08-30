declare module 'next' {
  export interface Metadata { [key: string]: unknown }
  export interface NextConfig { [key: string]: unknown }
}
declare module 'next/link' {
  import type { AnchorHTMLAttributes, ReactNode } from 'react'
  export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }): ReactNode
}
declare module 'next/navigation' { export function notFound(): never }
