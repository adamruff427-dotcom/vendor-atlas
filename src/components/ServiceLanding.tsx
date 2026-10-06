import { LandingAnalytics } from './LandingAnalytics'
import { ServiceFinder } from './ServiceFinder'
import { servicePages } from '../content/service-pages'
import { pages } from '../content/pages'
import { serviceIds, type ServiceId } from '../domain/types'

export function ServiceLanding({ serviceId }: { serviceId: ServiceId }) {
  const guides = Object.fromEntries(serviceIds.map(id => [id,
    (id === 'dsear' ? pages : servicePages[id]).slice(1).map(page => ({
      path: page.path, title: page.title,
    })),
  ])) as Record<ServiceId, Array<{ path: string; title: string }>>

  return <>
    <LandingAnalytics service={serviceId} />
    <ServiceFinder key={serviceId} initialService={serviceId} guides={guides} />
  </>
}
