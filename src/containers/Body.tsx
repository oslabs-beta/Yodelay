import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {Request} from '../components/EditorRequest'
import {Response} from '../components/EditorResponse'

// sets type for props
interface BodyProps {

  }
  export const Body: FunctionComponent<BodyProps> = props => {
    {
    //   const {
    //     incrementAction
    //   } = props
      return (
        <div style = {{border: "solid 1px green", flexGrow: 2}}>
        Body
        <Request></Request>
        <Response></Response>
        </div>
      )
    }
  }
  

export default Body

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