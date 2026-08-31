import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages.lev
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/lev${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/lev' ? [] : page.path.replace('/lev/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); return page ? { title: page.title, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path } } : {} }
export default async function LevPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/lev' ? <ServiceLanding serviceId="lev" /> : <ServiceDecisionArticle serviceId="lev" page={page} /> }
