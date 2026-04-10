import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from './Kbd'

const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = { args: { children: '⌘K' } }
export const Enter: Story = { args: { children: 'Enter' } }
export const Shortcut: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-sm text-ds-text-muted">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open
    </div>
  ),
}
