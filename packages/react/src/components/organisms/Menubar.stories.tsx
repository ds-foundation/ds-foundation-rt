import type { Meta, StoryObj } from '@storybook/react'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarSeparator, MenubarShortcut, MenubarCheckboxItem, MenubarLabel } from './Menubar'

const meta: Meta<typeof Menubar> = {
  title: 'Organisms/Menubar',
  component: Menubar,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Menubar>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print… <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Text</MenubarLabel>
          <MenubarCheckboxItem checked>Word Wrap</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Find <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
