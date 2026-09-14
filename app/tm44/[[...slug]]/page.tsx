import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages.tm44
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/tm44${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/tm44' ? [] : page.path.replace('/tm44/', '').split('/') })) }
export default async function Tm44Page({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/tm44' ? <ServiceLanding serviceId="tm44" /> : <ServiceDecisionArticle serviceId="tm44" page={page} /> }
