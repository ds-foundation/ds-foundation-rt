import { render, screen } from '@testing-library/react'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  test('renders keyboard text', () => {
    render(<Kbd>⌘K</Kbd>)
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  test('renders as kbd element', () => {
    const { container } = render(<Kbd>Enter</Kbd>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })

  test('accepts className override', () => {
    const { container } = render(<Kbd className="custom-class">Tab</Kbd>)
    expect(container.querySelector('kbd')).toHaveClass('custom-class')
  })
})
