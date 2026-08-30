import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AssessmentWizard } from '../components/AssessmentWizard'

describe('assessment wizard', () => {
  it('completes the qualification flow and renders an explainable result', async () => { const user = userEvent.setup(); render(<AssessmentWizard/>); expect(screen.getByRole('heading', { name: 'Do I need a DSEAR assessment?' })).toBeInTheDocument(); await user.click(screen.getByText('Spray painting/coating')); await user.click(screen.getByRole('button', { name: 'Continue' })); await user.click(screen.getByText('Solvents or paints')); await user.click(screen.getByRole('button', { name: 'Continue' })); await user.click(screen.getByRole('button', { name: 'See my result' })); expect(screen.getByRole('heading', { name: /assessment is likely to be relevant/i })).toBeInTheDocument(); expect(screen.getByText(/Deterministic Vendor Atlas estimate/)).toBeInTheDocument(); expect(screen.getAllByText(/Evidence found/)).toHaveLength(3); expect(screen.getByRole('button', { name: 'Prepare my quote request' })).toBeInTheDocument() })
})
