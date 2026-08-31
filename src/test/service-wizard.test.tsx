import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ServiceAssessmentWizard } from '../components/ServiceAssessmentWizard'

describe('industrial service wizard', () => {
  it('completes the LEV journey and shows an explainable result, price and shortlist', async () => {
    const user = userEvent.setup()
    render(<ServiceAssessmentWizard serviceId="lev" />)
    const first = screen.getByRole('button', { name: 'Continue' })
    expect(first).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByText('Welding or metal fume'))
    expect(first).toBeEnabled()
    await user.click(first)
    const second = screen.getByRole('button', { name: 'Continue' })
    await user.click(screen.getByText('On-tool extraction'))
    expect(second).toBeEnabled()
    await user.click(second)
    const resultButton = screen.getByRole('button', { name: 'See my result' })
    expect(resultButton).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Approximate site size'), 'small')
    await user.selectOptions(screen.getByLabelText('Commissioning data, logbook and previous reports'), 'partial')
    await user.selectOptions(screen.getByLabelText('Last thorough examination and test'), 'overdue-or-unknown')
    await user.selectOptions(screen.getByLabelText('Reason for commissioning'), 'first-examination')
    await user.selectOptions(screen.getByLabelText('Region'), 'midlands')
    await user.selectOptions(screen.getByLabelText('Desired timescale'), 'one-month')
    expect(resultButton).toBeEnabled()
    await user.click(resultButton)
    expect(screen.getByRole('heading', { name: /LEV testing is likely to be relevant/i })).toBeInTheDocument()
    expect(screen.getByText(/Deterministic Vendor Atlas estimate/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Evidence found/i)).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Continue with my project brief' }))
    expect(screen.getByRole('heading', { name: 'Who should we contact about this project?' })).toBeInTheDocument()
  })

  it('requires an explicit duty-indicator answer and does not allow an accidental blank', async () => {
    const user = userEvent.setup()
    render(<ServiceAssessmentWizard serviceId="pressure-systems" />)
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByText('Compressed-air system'))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const next = screen.getByRole('button', { name: 'Continue' })
    expect(next).toBeDisabled()
    await user.click(screen.getByText('Pressure or fluid details unknown'))
    expect(next).toBeEnabled()
  })
})
