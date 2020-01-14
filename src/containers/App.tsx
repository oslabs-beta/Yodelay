import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { RootState } from "../reducers";
import HeaderContainer, { Header } from "./Header";
import BodyContainer from "./Body";
import FooterContainer from "./Footer";
import NavbarContainer from "./Navbar";
import { Popup } from "../components/Popup";
import { Button } from "../components/common/Button";
import {
  incrementActionCreator,
  uploadProtoActionCreator,
  uploadProtoSuccessfulActionCreator,
  loadServiceActionCreator,
  showPopupActionCreator,
  changeThemeActionCreator
} from "../actions";
import { countSelector } from "../reducers/test";
import {
  protoSelector,
  parsedProtoObjSelector,
  popupSelector
} from "../reducers/uploadProto";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../scss/index.scss";
import { serviceMenuSelector } from "../reducers/updateMenu";
import { themeSelector } from "../reducers/changeTheme";

// import { loggedInSelector } from '../reducers/login'

// sets type for props
interface AppProps {
  incrementAction: typeof incrementActionCreator;
  uploadProtoSuccessful: typeof uploadProtoSuccessfulActionCreator;
  serviceOptions: object;
  protoObjContents: object;
  togglePopup: typeof showPopupActionCreator;
  proto: string | ArrayBuffer;
  popupStatus: boolean;
  changeThemeAction: typeof changeThemeActionCreator;
  changeTheme: string;
}
export const App: FunctionComponent<AppProps> = props => {
  {
    const {
      incrementAction,
      serviceOptions,
      protoObjContents,
      togglePopup,
      proto,
      popupStatus,
      changeTheme
    } = props;

    //CHANGE THEME
    let toggleThemeMainView = `main-view-${changeTheme}`;
    let toggleThemeNavBar = `navbar-${changeTheme}`;

    return (
      //Wrap everything in Router so that nested containers/components have access to router
      <Router>
        {/* main-view */}
        <div id={toggleThemeMainView}>
          <div id={toggleThemeNavBar}>
            <NavbarContainer></NavbarContainer>
          </div>

          <div id="app-container">
            <HeaderContainer></HeaderContainer>
            <BodyContainer serviceOptions={serviceOptions}></BodyContainer>
            <FooterContainer></FooterContainer>
          </div>
          <div>
            <Popup
              popup={popupStatus}
              toggle={togglePopup}
              proto={proto}
            ></Popup>
          </div>
          {/* <Button text='enter' onClick={ () => {incrementAction(1)}} >
            </Button> */}
        </div>
      </Router>
    );
  }
};

// gives the app component access to state and actions from the store
export default connect(
  //if using selector
  (state: RootState) => ({
    test: countSelector(state),
    protoContents: protoSelector(state),
    serviceOptions: serviceMenuSelector(state),
    protoObjContents: parsedProtoObjSelector(state),
    proto: protoSelector(state),
    popupStatus: popupSelector(state),
    changeTheme: themeSelector(state)
  }),
  {
    incrementAction: incrementActionCreator,
    uploadProto: uploadProtoActionCreator,
    uploadProtoSuccessful: uploadProtoSuccessfulActionCreator,
    loadServiceOptions: loadServiceActionCreator,
    togglePopup: showPopupActionCreator,
    changeThemeAction: changeThemeActionCreator
  }
)(App);

//if not using selector
// (state: RootState) => ({
//   test: state.test
// }),
