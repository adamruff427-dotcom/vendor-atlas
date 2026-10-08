import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ServiceFinder } from '../components/ServiceFinder'
import { serviceIds, type ServiceId } from '../domain/types'
import { serviceDefinitions } from '../domain/service-assessment'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})
const guides = Object.fromEntries(serviceIds.map(id => [id, [{ path: '/' + id + '/cost', title: id + ' cost guide' }]])) as Record<ServiceId, Array<{ path: string; title: string }>>

describe('one shared service finder', () => {
  it('offers every service and swaps guidance without producing assessment events', async () => {
    const user = userEvent.setup()
    const events: string[] = []
    const listener = (event: Event) => events.push((event as CustomEvent).detail.event)
    window.addEventListener('vendor-atlas:analytics', listener)
    try {
      render(<ServiceFinder initialService="dsear" guides={guides} />)
      const picker = screen.getByLabelText('Which service are you looking for?')
      expect(picker.querySelectorAll('option')).toHaveLength(serviceIds.length)
      for (const id of serviceIds) {
        await user.selectOptions(picker, id)
        expect(screen.getByRole('heading', { name: id === 'dsear' ? 'Do I need a DSEAR assessment?' : serviceDefinitions[id].question })).toBeInTheDocument()
        if (id === 'kitchen-extract-cleaning') {
          expect(screen.getByRole('link', { name: 'Sources and provider evidence' })).toHaveAttribute('href', '/?service=kitchen-extract-cleaning#guidance')
        } else if (id === 'workplace-first-aid-training') {
          expect(screen.getByRole('link', { name: 'HSE sources and provider evidence' })).toHaveAttribute('href', '/?service=workplace-first-aid-training#guidance')
        } else {
          expect(screen.getByRole('link', { name: 'Supplier evidence directory →' })).toHaveAttribute('href', id === 'dsear' ? '/dsear/suppliers' : serviceDefinitions[id].supplierPath)
        }
      }
      expect(events).toContain('landing_page_view')
      expect(events).not.toContain('assessment_started')
    } finally {
      window.removeEventListener('vendor-atlas:analytics', listener)
    }
  })

  it('preselects a deep-linked service and resets answers when switching away and back', async () => {
    const user = userEvent.setup()
    render(<ServiceFinder initialService="lev" guides={guides} />)
    expect(screen.getByLabelText('Which service are you looking for?')).toHaveValue('lev')
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByText('Wood dust'))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
    await user.selectOptions(screen.getByLabelText('Which service are you looking for?'), 'loler')
    await user.selectOptions(screen.getByLabelText('Which service are you looking for?'), 'lev')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    expect(screen.getByLabelText('Business or industry')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })
})
