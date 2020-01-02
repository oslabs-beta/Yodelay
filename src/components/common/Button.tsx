import React, { FunctionComponent } from 'react'
import { urlencoded } from 'body-parser'

interface ButtonProps {
  id?: string
  onClick?: (...arg: any[]) => any
  text: string
  value?: number
  icon?: string
}

export const Button:
FunctionComponent<ButtonProps> = props => {
  {
    const {
      id, 
      onClick,
      text,
      value, 
      icon
    } = props

    console.log(icon)
  
  return (
  <button id={id} onClick={onClick} value={value} style = {{backgroundImage: `url(${icon})`}}>{text}</button>
    ) 
  }
}
