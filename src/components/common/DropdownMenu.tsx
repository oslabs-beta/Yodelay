import React, { FunctionComponent } from 'react'

interface DropdownMenuProps {
  id?: string
  options?: string[]
}

export const DropdownMenu:
FunctionComponent<DropdownMenuProps> = props => {
  {
  const {
  id, 
  options
  } = props
 return (
  <div>
    <select>
    {options.map((option, i)=> <option key = {i}>{option}</option>
    )}
    </select>
  </div>
 )}
}
  





