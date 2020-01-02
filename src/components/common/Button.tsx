import React, { FunctionComponent } from 'react'

interface ButtonProps {
  id?: string
  onClick?: (...arg: any[]) => any
  text: string
  value?: number
  icon?: string
}

export const Button:
FunctionComponent<ButtonProps> = ({
  id, 
  onClick,
  text,
  value, 
  icon
}) => (
  <button id={id} onClick={onClick} value={value} style = {{background: `url${icon}`}}>{text}</button>
)