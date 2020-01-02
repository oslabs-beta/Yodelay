import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

// sets type for props
interface FooterProps {

  }
  export const Footer: FunctionComponent<FooterProps> = props => {
    {
    //   const {
    //     incrementAction
    //   } = props
      return (
        <div id = "footer">
        Built with 💛 by the Yodelays (v1.0 beta)

        </div>
      )
    }
  }

export default Footer

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