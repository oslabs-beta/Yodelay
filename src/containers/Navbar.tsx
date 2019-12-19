import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

// sets type for props
interface NavbarProps {

  }
  export const Navbar: FunctionComponent<NavbarProps> = props => {
    {
    //   const {
    //     incrementAction
    //   } = props
      return (
        <div>
        Navbar
        </div>
      )
    }
  }

  export default Navbar

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