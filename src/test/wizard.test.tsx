import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AssessmentWizard } from '../components/AssessmentWizard'

describe('assessment wizard', () => {
  it('requires deliberate answers and renders an explainable result', async () => {
    const user = userEvent.setup()
    render(<AssessmentWizard/>)

    const firstContinue = screen.getByRole('button', { name: 'Continue' })
    expect(firstContinue).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
    await user.click(screen.getByText('Spray painting/coating'))
    expect(firstContinue).toBeEnabled()
    await user.click(firstContinue)

    const hazardContinue = screen.getByRole('button', { name: 'Continue' })
    expect(hazardContinue).toBeDisabled()
    await user.click(screen.getByText('Solvents or paints'))
    await user.click(hazardContinue)

    const resultButton = screen.getByRole('button', { name: 'See my result' })
    expect(resultButton).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Approximate site size'), 'small')
    await user.selectOptions(screen.getByLabelText('Existing DSEAR assessment'), 'none')
    await user.selectOptions(screen.getByLabelText('Reason for review'), 'first-assessment')
    await user.selectOptions(screen.getByLabelText('Region'), 'midlands')
    await user.selectOptions(screen.getByLabelText('Desired timescale'), 'one-month')
    expect(resultButton).toBeEnabled()
    await user.click(resultButton)

    expect(screen.getByRole('heading', { name: /assessment is likely to be relevant/i })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Assessment questions complete' })).toHaveAttribute('aria-valuemax', '3')
    expect(screen.getByText(/Deterministic Vendor Atlas estimate/)).toBeInTheDocument()
    expect(screen.getAllByText(/Evidence found/)).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Continue with my project brief' }))
    expect(screen.getByRole('heading', { name: 'Who should we contact about this project?' })).toBeInTheDocument()
    expect(screen.getByText(/aim to contact you within two working days/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send project brief for review' })).toBeInTheDocument()
  })

  it('allows an explicit no-listed-hazards answer but not an accidental blank step', async () => {
    const user = userEvent.setup()
    render(<AssessmentWizard/>)
    await user.selectOptions(screen.getByLabelText('Business or industry'), 'laboratory')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).toBeDisabled()
    await user.click(screen.getByText('None of these'))
    expect(continueButton).toBeEnabled()
  })
})
