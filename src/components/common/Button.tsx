import React, { FunctionComponent } from 'react'
import { urlencoded } from 'body-parser'

interface ButtonProps {
  className?: string
  onClick?: (...arg: any[]) => any
  text?: string
  value?: number
  icon?: string
}

export const Button:
FunctionComponent<ButtonProps> = props => {
  {
    const {
      className, 
      onClick,
      text,
      value, 
      icon
    } = props

    console.log(icon)
  
  return (
  <button className={className} onClick={onClick} value={value}>{text}</button>
    ) 
  }
}

// style = { {backgroundImage: `url(${icon})`}}
