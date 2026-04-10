import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

vi.mock('../utils/useReducedMotion', () => ({ useReducedMotion: vi.fn() }))

import { useReducedMotion } from '../utils/useReducedMotion'

function renderAccordion() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Title</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  test('AccordionContent has animate classes when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { container } = renderAccordion()
    const content =
      container.querySelector('[data-radix-accordion-content]') ??
      container.querySelector('.overflow-hidden')
    expect(content?.className).toContain('animate-accordion')
  })

  test('AccordionContent omits animate classes when reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = renderAccordion()
    const content =
      container.querySelector('[data-radix-accordion-content]') ??
      container.querySelector('.overflow-hidden')
    expect(content?.className).not.toContain('animate-accordion')
  })

  test('ChevronDown omits transition classes when reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = renderAccordion()
    const chevron = container.querySelector('svg')
    const className = chevron?.className.baseVal ?? chevron?.getAttribute('class') ?? ''
    expect(className).not.toContain('transition-transform')
  })

  test('ChevronDown has transition classes when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { container } = renderAccordion()
    const chevron = container.querySelector('svg')
    const className = chevron?.className.baseVal ?? chevron?.getAttribute('class') ?? ''
    expect(className).toContain('transition-transform')
  })

  test('AccordionTrigger omits transition-all when reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = renderAccordion()
    // The trigger is a <button> inside AccordionPrimitive.Header
    const trigger = container.querySelector('button')
    expect(trigger?.className).not.toContain('transition-all')
  })
})
