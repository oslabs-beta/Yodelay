import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../reducers'
import HeaderContainer, { Header } from './Header'
import BodyContainer from './Body'
import FooterContainer from './Footer'
import NavbarContainer from './Navbar'
import { Button } from '../components/common/Button'
import { incrementActionCreator, uploadProtoActionCreator, uploadProtoSuccesfulActionCreator, loadServiceActionCreator } from '../actions';
import { countSelector } from '../reducers/test';
import { protoSelector, protoObjSelector } from '../reducers/uploadProto'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import '../scss/index.scss'
import { serviceMenuSelector } from '../reducers/updateMenu'

// import { loggedInSelector } from '../reducers/login'

// sets type for props
interface AppProps {
  incrementAction: typeof incrementActionCreator,
  uploadProtoSuccessful: typeof uploadProtoSuccesfulActionCreator 
  protoObjContents: object
  serviceOptions: object
  
}
export const App: FunctionComponent<AppProps> = props => {
  {
    const {
      incrementAction,
      protoObjContents, 
      serviceOptions
    } = props

    // console.log(serviceOptions)
  
    return (
      //Wrap everything in Router so that nested containers/components have access to router
      <Router>
        <div id = "main-view">
            <div id = "navbar">
              <NavbarContainer></NavbarContainer>
            </div>
            
            <div id = "app-container">
              <HeaderContainer></HeaderContainer>
              <BodyContainer serviceOptions = {serviceOptions}></BodyContainer>
              <FooterContainer></FooterContainer>
            </div>
            {/* <Button text='enter' onClick={ () => {incrementAction(1)}} >
            </Button> */}
       
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
      protoObjContents: protoObjSelector(state),
      serviceOptions: serviceMenuSelector(state)
    })
    ,

  {
    incrementAction: incrementActionCreator,
    uploadProto: uploadProtoActionCreator,
    uploadProtoSuccessful: uploadProtoSuccesfulActionCreator,
    loadServiceOptions:loadServiceActionCreator
  }
)(App)

  //if not using selector
  // (state: RootState) => ({
  //   test: state.test
  // }),
  