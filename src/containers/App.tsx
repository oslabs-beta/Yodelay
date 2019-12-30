import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../reducers'
import HeaderContainer, { Header } from './Header'
import BodyContainer from './Body'
import FooterContainer from './Footer'
import NavbarContainer from './Navbar'
import { Button } from '../components/common/Button'
import { incrementActionCreator, uploadProtoActionCreator, uploadProtoSuccesfulActionCreator } from '../actions';
import { countSelector } from '../reducers/test';
import { protoSelector, protoObjSelector } from '../reducers/uploadProto'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import '../scss/index.scss'

// import { loggedInSelector } from '../reducers/login'

// sets type for props
interface AppProps {
  incrementAction: typeof incrementActionCreator,
  uploadProtoSuccessful: typeof uploadProtoSuccesfulActionCreator 
 
  
}
export const App: FunctionComponent<AppProps> = props => {
  {
    const {
      incrementAction,
    } = props

  
    return (
      //Wrap everything in Router so that nested containers/components have access to router
      <Router>
        <div>
          <div id = "main-view" style = {{display: "flex", flexDirection: "row", height: "100%", alignItems: "stretch"}}>
            <div style = {{border: "solid 1px black"}}>
              <NavbarContainer></NavbarContainer>
            </div>
            
            <div style = {{border: "solid 1px red", display: "flex", flexDirection: "column", width: "100%"}}>
              <HeaderContainer></HeaderContainer>
              <BodyContainer></BodyContainer>
              <FooterContainer></FooterContainer>
            </div>
            <Button text='enter' onClick={ () => {incrementAction(1)}} >
            </Button>
          </div>
        </div>
      </Router>
    )
  }
}

// gives the app component access to state and actions from the store
export default connect(

  //if using selector
  (state: RootState) => ({
      test: countSelector(state),
      protoContents: protoSelector(state),
      protoObjContents: protoObjSelector(state)

    })
    ,
  //if not using selector
  // (state: RootState) => ({
  //   test: state.test
  // }),
  
  {
    incrementAction: incrementActionCreator,
    uploadProto: uploadProtoActionCreator,
    uploadProtoSuccessful: uploadProtoSuccesfulActionCreator
  }
)(App)