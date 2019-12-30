import React, { FunctionComponent } from 'react'

interface DropdownMenuProps {
  id?: string
  onClick?: (...arg: any[]) => any
  options?: string[]
}

export const DropdownMenu:
FunctionComponent<DropdownMenuProps> = ({
  id, 
  onClick,
  options
}) => (
  <div>
    <select>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
        <option>Option 4</option>

    </select>

  </div>
)





