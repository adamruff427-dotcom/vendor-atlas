import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages.loler
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/loler${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/loler' ? [] : page.path.replace('/loler/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); return page ? { title: page.title, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path } } : {} }
export default async function LolerPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/loler' ? <ServiceLanding serviceId="loler" /> : <ServiceDecisionArticle serviceId="loler" page={page} /> }
