import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages['emergency-lighting']
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/emergency-lighting${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/emergency-lighting' ? [] : page.path.replace('/emergency-lighting/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); if (!page) return {}; return { title: page.title, description: page.description, alternates: { canonical: page.path } } }
export default async function EmergencyLightingPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/emergency-lighting' ? <ServiceLanding serviceId="emergency-lighting" /> : <ServiceDecisionArticle serviceId="emergency-lighting" page={page} /> }
