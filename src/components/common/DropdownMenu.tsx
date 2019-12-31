import React, { FunctionComponent } from 'react'

interface DropdownMenuProps {
  id?: string
  serviceOptions?: string[]
  requestOptions?: string[]
}

export const DropdownMenu:
FunctionComponent<DropdownMenuProps> = props => {
  {
  const {
  id, 
  serviceOptions
  } = props
  console.log(serviceOptions)
 return (
  <div>
    <select>
    {serviceOptions.map((option, i)=> <option key = {i}>{option}</option>
    )}
    </select>
  </div>
 )}
}
  





