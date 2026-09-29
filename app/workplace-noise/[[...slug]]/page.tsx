import { notFound } from 'next/navigation'
import { ServiceDecisionArticle } from '../../../src/components/ServiceDecisionArticle'
import { ServiceLanding } from '../../../src/components/ServiceLanding'
import { servicePages } from '../../../src/content/service-pages'

type Props = { params: Promise<{ slug?: string[] }> }
const pages = servicePages['workplace-noise']
const resolvePage = (slug?: string[]) => pages.find((page) => page.path === `/workplace-noise${slug?.length ? `/${slug.join('/')}` : ''}`)
export function generateStaticParams() { return pages.map((page) => ({ slug: page.path === '/workplace-noise' ? [] : page.path.replace('/workplace-noise/', '').split('/') })) }
export default async function WorkplaceNoisePage({ params }: Props) { const page = resolvePage((await params).slug); if (!page) notFound(); return page.path === '/workplace-noise' ? <ServiceLanding serviceId="workplace-noise" /> : <ServiceDecisionArticle serviceId="workplace-noise" page={page} /> }
