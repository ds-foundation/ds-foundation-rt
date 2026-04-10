import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'

vi.mock('../utils/useReducedMotion', () => ({ useReducedMotion: vi.fn() }))

import { useReducedMotion } from '../utils/useReducedMotion'

describe('Skeleton', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
  })

  test('renders animate-pulse when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { container } = render(<Skeleton data-testid="sk" />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  test('omits animate-pulse when reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = render(<Skeleton data-testid="sk" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  test('always has bg-ds-sunken', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('bg-ds-sunken')
  })
})
