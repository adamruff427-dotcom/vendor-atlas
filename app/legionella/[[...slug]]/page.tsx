import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages.legionella
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/legionella${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/legionella' ? [] : page.path.replace('/legionella/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); return page ? { title: page.title, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path } } : {} }
export default async function LegionellaPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/legionella' ? <ServiceLanding serviceId="legionella" /> : <ServiceDecisionArticle serviceId="legionella" page={page} /> }
