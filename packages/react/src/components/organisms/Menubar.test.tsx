import { render, screen } from '@testing-library/react'
import { Menubar, MenubarMenu, MenubarTrigger } from './Menubar'

describe('Menubar', () => {
  test('renders menubar with triggers', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
    expect(screen.getByRole('menubar')).toBeInTheDocument()
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
})
