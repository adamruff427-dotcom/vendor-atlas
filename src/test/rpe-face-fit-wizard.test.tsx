import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ServiceAssessmentWizard } from '../components/ServiceAssessmentWizard'

afterEach(cleanup)

async function completeSiteDetails(user: ReturnType<typeof userEvent.setup>, records: 'available' | 'partial' = 'partial') {
  await user.selectOptions(screen.getByLabelText('Approximate site size'), 'small')
  await user.selectOptions(screen.getByLabelText('RPE selection, COSHH information and fit-test records'), records)
  await user.selectOptions(screen.getByLabelText('Current fit-test position for the selected facepiece'), 'overdue-or-unknown')
  await user.selectOptions(screen.getByLabelText('What prompted these fit tests?'), 'routine')
  await user.selectOptions(screen.getByLabelText('Region'), 'midlands')
  await user.selectOptions(screen.getByLabelText('Desired timescale'), 'one-month')
}

describe('RPE face-fit shared wizard', () => {
  it('completes a bounded fit-test brief, displays its source-limited price and allows quote intent', async () => {
    const user = userEvent.setup()
    render(<ServiceAssessmentWizard serviceId="rpe-face-fit-testing" />)
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByRole('checkbox', { name: /Reusable half mask/i }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /Qualitative test/i }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await completeSiteDetails(user)
    await user.click(screen.getByRole('button', { name: 'See my result' }))

    expect(screen.getByRole('heading', { name: 'RPE face-fit testing is likely to be relevant' })).toBeInTheDocument()
    expect(screen.getAllByText('£375')).toHaveLength(2)
    expect(screen.getByText(/not a UK market range, a matched-provider comparison or a live quote/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Evidence found/i)).toHaveLength(3)
    expect(screen.getAllByText(/not a COSHH assessment, RPE selection decision/i)).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Continue with fit-test quote brief' }))
    expect(screen.getByRole('heading', { name: 'Who should we contact about this project?' })).toBeInTheDocument()
    expect(screen.getByText(/selected method, wearer count, facepiece details/i)).toBeInTheDocument()
  })

  it('does not invent a fit-test requirement or expose price, suppliers or quote intent when no tight facepiece is selected', async () => {
    const user = userEvent.setup()
    render(<ServiceAssessmentWizard serviceId="rpe-face-fit-testing" />)
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByRole('checkbox', { name: /No tight-fitting facepiece is selected/i }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await completeSiteDetails(user, 'available')
    await user.click(screen.getByRole('button', { name: 'See my result' }))

    expect(screen.getByRole('heading', { name: 'No tight-fitting facepiece was selected' })).toBeInTheDocument()
    expect(screen.queryByText('£375')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Providers with evidence/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue with fit-test quote brief' })).not.toBeInTheDocument()
  })
})
