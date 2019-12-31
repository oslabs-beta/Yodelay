import React, {FunctionComponent} from 'react'
import {EditorRequest} from './EditorRequest'
import {EditorResponse} from './EditorResponse'
import { statement } from '@babel/template';
import {setMessageActionCreator} from '../actions'
import { useDispatch } from 'react-redux';


interface editorProps {
  setMessageAction?: typeof setMessageActionCreator
  data: string
}

export const Editor: FunctionComponent<editorProps> = props => {
  {
    const { 
      setMessageAction,
      data
    } = props
    
    return (
      <>
        <EditorRequest 
          data={data}
          newRequest={(value) => {
            console.log('HERE', value)
            setMessageAction(value)
          }}
        />   
  
        <EditorResponse/>
      </>
    )
  }
}