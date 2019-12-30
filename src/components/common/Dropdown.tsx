import React, { FunctionComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'

interface DropdownProps {
  id?: string
  onClick?: (...arg: any[]) => any
  text?: string
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid black;
`;

export const Dropdown:
FunctionComponent<DropdownProps> = ({
  id, 
  onClick,
  text
}) => (
  <Downshift>
       {({ getInputProps, getRootProps }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
        </Form>
      )}
  </Downshift>
)