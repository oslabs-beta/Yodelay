import React, { FunctionComponent } from 'react'

interface ButtonProps {
  id?: string
  onClick?: (...arg: any[]) => any
  text: string
  value?: number
}

export const Button:
FunctionComponent<ButtonProps> = ({
  id, 
  onClick,
  text,
  value
}) => (
  <button id={id} onClick={onClick} value={value}>{text}</button>
)