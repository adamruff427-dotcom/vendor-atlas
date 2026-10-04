import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages['fire-extinguisher-servicing']
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/fire-extinguisher-servicing${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/fire-extinguisher-servicing' ? [] : page.path.replace('/fire-extinguisher-servicing/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); if (!page) return {}; return { title: page.title, description: page.description, alternates: { canonical: page.path } } }
export default async function Page({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/fire-extinguisher-servicing' ? <ServiceLanding serviceId="fire-extinguisher-servicing" /> : <ServiceDecisionArticle serviceId="fire-extinguisher-servicing" page={page} /> }
