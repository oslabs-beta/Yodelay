import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

// sets type for props
interface HeaderProps {

  }
  export const Header: FunctionComponent<HeaderProps> = props => {
    {
    //   const {
    //     incrementAction
    //   } = props
      return (
        <div style = {{border: "solid 1px purple"}}>
        Header
        </div>
      )
    }
  }
  


  export default Header

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