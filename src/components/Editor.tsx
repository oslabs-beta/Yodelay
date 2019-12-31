import React, {FunctionComponent} from 'react'
import {EditorRequest} from './EditorRequest'
import {EditorResponse} from './EditorResponse'
import { statement } from '@babel/template';
import {setRequestActionCreator} from '../actions'


interface editorProps {
  setRequestAction?: typeof setRequestActionCreator

}

export const Editor: FunctionComponent<editorProps> = props => {
  {
    const { 
      setRequestAction,
    } = props

    return (
      <>
        <EditorRequest 
          
          newRequest={(values) => {
            console.log('HERE', values)
            setRequestAction(values)
          }}
        />   
  
        <EditorResponse>
        </EditorResponse>
      </>
    )
  }
}