import React, {FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from '../components/common/Button'
import GitHubButton from 'react-github-btn'


// sets type for props
interface HeaderProps {

  }
  export const Header: FunctionComponent<HeaderProps> = props => {
    {

      //test buttons - remove later
      // const testClick = () =>{
      //   alert("clicked")
      // }

      return (
        <div id = "header-container">
        
        
        {/* On click, sends user back to home page */}
        <Link to ="/">
            <Button className = "header-button button" text='Yodelay.io'  >
            </Button>
            
            {/* <GitHubButton href="https://github.com/oslabs-beta/Yodelay" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star oslabs-beta/Yodelay on GitHub">Star</GitHubButton> */}
          </Link>
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