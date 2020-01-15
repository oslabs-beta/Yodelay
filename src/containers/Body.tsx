import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import TestProto from "../components/TestProto";
import Settings from "../components/Settings";
import { Route } from "react-router";
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator,
  clearResponseEditorActionCreator,
  showPopupActionCreator,
  changeThemeActionCreator,
  setWsCommandActionCreator
} from "../actions";
import {
  messageSelector,
  serviceSelector,
  urlSelector,
  requestSelector,
  responseSelector,
  typeResponse,
  typeRequest,
  parsedProtoObjSelector,
  protoSelector,
  popupSelector,
  setWsSelector
} from "../reducers/uploadProto";
import { RootState } from "../reducers";
import { themeSelector } from "../reducers/changeTheme";

// sets type for props
interface BodyProps {
  parsedProtoObj: object;
  serviceOptions: object;
  setMessageAction: typeof setMessageActionCreator;
  setUrlAction: typeof setUrlActionCreator;
  setRequestAction: typeof setRequestActionCreator;
  setServiceAction: typeof setServiceActionCreator;
  sendUnaryRequestAction?: typeof sendUnaryRequestActionCreator;
  clearResponseEditorAction: typeof clearResponseEditorActionCreator;
  setWsCommandAction: typeof setWsCommandActionCreator;
  selectMessage: string;
  selectService: string;
  selectUrl: string;
  selectRequest: typeRequest;
  selectResponse: typeResponse[];
  selectWsCommand: string;
  proto: string | ArrayBuffer;
  togglePopup?: typeof showPopupActionCreator;
  popupStatus?: boolean;
  changeThemeAction: typeof changeThemeActionCreator;
  changeTheme: string;

}

export const Body: FunctionComponent<BodyProps> = props => {
  {
    const {
      parsedProtoObj,
      serviceOptions,
      setMessageAction,
      setServiceAction,
      setUrlAction,
      setRequestAction,
      setWsCommandAction,
      sendUnaryRequestAction,
      clearResponseEditorAction,
      selectWsCommand,
      selectMessage,
      selectService,
      selectUrl,
      selectRequest,
      selectResponse,
      togglePopup,
      popupStatus,
      proto,
      changeTheme
    } = props;

    return (
      <div>
        <Route exact path="/">
          <TestProto
            parsedProtoObj={parsedProtoObj}
            serviceOptions={serviceOptions}
            setMessageAction={setMessageAction}
            setRequestAction={setRequestAction}
            setServiceAction={setServiceAction}
            setUrlAction={setUrlAction}
            setWsCommandAction={setWsCommandAction}
            sendUnaryRequestAction={sendUnaryRequestAction}
            clearResponseEditor={clearResponseEditorAction}
            url={selectUrl}
            data={selectMessage}
            request={selectRequest}
            response={selectResponse}
            togglePopup={togglePopup}
            popupStatus={popupStatus}
            proto={proto}
            service={selectService}
            changeTheme={changeTheme}
            wsCommand={selectWsCommand}
          ></TestProto>
        </Route>
        <Route path="/settings">
          <Settings>Settings</Settings>
        </Route>
      </div>
    );
  }
};

export default connect(
  // gives the app component access to state and actions from the store
  //   export default connect(

  //     //using selector

  (state: RootState) => ({
    parsedProtoObj: parsedProtoObjSelector(state),
    selectMessage: messageSelector(state),
    selectService: serviceSelector(state),
    selectUrl: urlSelector(state),
    selectRequest: requestSelector(state),
    selectResponse: responseSelector(state),
    proto: protoSelector(state),
    popupStatus: popupSelector(state),
    changeTheme: themeSelector(state),
    selectWsCommand: setWsSelector(state)
  }),
  {
    setMessageAction: setMessageActionCreator,
    setServiceAction: setServiceActionCreator,
    setUrlAction: setUrlActionCreator,
    setRequestAction: setRequestActionCreator,
    sendUnaryRequestAction: sendUnaryRequestActionCreator,
    clearResponseEditorAction: clearResponseEditorActionCreator,
    togglePopup: showPopupActionCreator,
    changeThemeAction: changeThemeActionCreator,
    setWsCommandAction: setWsCommandActionCreator
  }
)(Body);
