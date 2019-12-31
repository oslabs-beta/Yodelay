import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import {setMessageActionCreator} from '../actions'
import {Editor} from './Editor'

// sets type for props
interface TestProtoProps {
  setMessageAction: typeof setMessageActionCreator
  data: string
}
  
  export const TestProto: FunctionComponent<TestProtoProps> = props => {
    {
      const {
        setMessageAction,
        data
      } = props

      console.log('testproto', data)
      return (
        <div style = {{border: "solid 1px green", flexGrow: 2}}>
        TestProto
          <Editor setMessageAction={setMessageAction} data={data} />
        </div>
      )
    }
  }
  

export default TestProto

  // gives the app component access to state and actions from the store
//   export default connect(
  
//     //using selector
//     (state: RootState) => ({
//         test: countSelector(state)
//       })
//       ,
    
//     {
//       incrementAction: incrementActionCreator,
//     }
//   )(App)