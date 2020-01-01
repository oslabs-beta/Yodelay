import React, {FunctionComponent, useState } from 'react'
import { connect } from 'react-redux'
import TestProto from '../components/TestProto'
import Settings from '../components/Settings'
import { Route } from 'react-router'
import {setMessageActionCreator} from '../actions'
import {messageSelector, responseSelector, typeResponse} from '../reducers/uploadProto'
import {RootState} from '../reducers'

// sets type for props
interface BodyProps {
  setMessageAction: typeof setMessageActionCreator
  selectMessage: string
  serviceOptions: object
  selectResponse: typeResponse
}

export const Body: FunctionComponent<BodyProps> = props => {
  {
    const {
      setMessageAction,
      selectMessage,
      serviceOptions,
      selectResponse
    } = props
    
    return (
      <div style = {{border: "solid 1px green", flexGrow: 2}}>
      Body
        <Route exact path = "/"> 
          <TestProto setMessageAction={setMessageAction} data={selectMessage} response={selectResponse} serviceOptions = {serviceOptions}>
            Test Proto
           </TestProto>
        </Route>
        <Route path = "/settings"> 
          <Settings>
            Settings
          </Settings>
        </Route>
      </div>
    )
  }
}
  

export default connect (

// gives the app component access to state and actions from the store
//   export default connect(

//     //using selector

    (state: RootState) => ({
        selectMessage: messageSelector(state),
        selectResponse: responseSelector(state)
      }),
    {
      setMessageAction: setMessageActionCreator,
    }
  )(Body)
