import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages['hand-arm-vibration']
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/hand-arm-vibration${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/hand-arm-vibration' ? [] : page.path.replace('/hand-arm-vibration/', '').split('/') })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = resolvePage((await params).slug); if (!page) return {}; return { title: page.title, description: page.description, alternates: { canonical: page.path } } }
export default async function HandArmVibrationPage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/hand-arm-vibration' ? <ServiceLanding serviceId="hand-arm-vibration" /> : <ServiceDecisionArticle serviceId="hand-arm-vibration" page={page} /> }
