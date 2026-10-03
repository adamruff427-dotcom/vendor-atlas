import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages['fire-alarm-servicing']
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/fire-alarm-servicing${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/fire-alarm-servicing' ? [] : page.path.replace('/fire-alarm-servicing/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); if (!page) return {}; return { title: page.title, description: page.description, alternates: { canonical: page.path } } }
export default async function FireAlarmServicingPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/fire-alarm-servicing' ? <ServiceLanding serviceId="fire-alarm-servicing" /> : <ServiceDecisionArticle serviceId="fire-alarm-servicing" page={page} /> }
