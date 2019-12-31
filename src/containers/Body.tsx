import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import TestProto from '../components/TestProto'
import Settings from '../components/Settings'
import { Route } from 'react-router'
import {setRequestActionCreator} from '../actions'
import {requestSelector} from '../reducers/uploadProto'
import {RootState} from '../reducers'

// sets type for props
interface BodyProps {
  setRequestAction: typeof setRequestActionCreator
}

export const Body: FunctionComponent<BodyProps> = props => {
  {
    const {
      setRequestAction
    } = props

    return (
      <div style = {{border: "solid 1px green", flexGrow: 2}}>
      Body
        <Route exact path = "/"> 
          <TestProto {...setRequestAction} >
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
        selectRequest: requestSelector(state)
      }),
    {
      setRequestAction: setRequestActionCreator,
    }
  )(Body)