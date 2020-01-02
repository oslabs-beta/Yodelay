import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// sets type for props
interface SettingsProps {

  }
  
  export const Settings: FunctionComponent<SettingsProps> = props => {
    {
    //   const {
    //     incrementAction
    //   } = props
      return (
        <div>
        ⚡⚙ COMING SOON ⚙⚡
        </div>
      )
    }
  }
  

export default Settings

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