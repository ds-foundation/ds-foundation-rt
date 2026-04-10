import { render, screen } from '@testing-library/react'
import { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption } from './Typography'

describe('Typography', () => {
  test.each([
    [Display, 'Display', 'var(--ds-font-size-7xl)'],
    [H1, 'H1', 'var(--ds-font-size-5xl)'],
    [H2, 'H2', 'var(--ds-font-size-4xl)'],
    [H3, 'H3', 'var(--ds-font-size-3xl)'],
    [H4, 'H4', 'var(--ds-font-size-2xl)'],
    [H5, 'H5', 'var(--ds-font-size-xl)'],
    [BodyLarge, 'BodyLarge', 'var(--ds-font-size-xl)'],
    [Body, 'Body', 'var(--ds-font-size-md)'],
    [BodySmall, 'BodySmall', 'var(--ds-font-size-sm)'],
    [Caption, 'Caption', 'var(--ds-font-size-xs)'],
  ] as const)('%s uses token CSS var %s', (Component, _name, expectedVar) => {
    const { container } = render(<Component>text</Component>)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain(expectedVar)
  })

  test('Display renders as h1', () => {
    render(<Display>Title</Display>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('Caption renders as span', () => {
    const { container } = render(<Caption>note</Caption>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  test('accepts className override', () => {
    render(<Body className="custom-class">text</Body>)
    const el = screen.getByText('text')
    expect(el).toHaveClass('custom-class')
  })
})
