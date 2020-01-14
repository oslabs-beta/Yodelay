import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator,
  clearResponseEditorActionCreator,
  showPopupActionCreator
} from "../actions";
import { Editor } from "./Editor";
import {
  typeResponse,
  typeRequest,
  popupSelector
} from "../reducers/uploadProto";
import { DropdownService } from "./DropdownService";
import { DropdownRequest } from "./DropdownRequest";
import { Button } from "./common/Button";

// sets type for props
interface TestProtoProps {
  parsedProtoObj: object;
  serviceOptions: object;
  data: string;
  service: string;
  url: string;
  response: typeResponse[];
  request: typeRequest;
  setMessageAction: typeof setMessageActionCreator;
  setServiceAction: typeof setServiceActionCreator;
  setUrlAction: typeof setUrlActionCreator;
  setRequestAction: typeof setRequestActionCreator;
  sendUnaryRequestAction: any;
  clearResponseEditor: typeof clearResponseEditorActionCreator;
  proto: string | ArrayBuffer;
  togglePopup: typeof showPopupActionCreator;
  popupStatus: boolean;
  changeTheme: string;
}

export const TestProto: FunctionComponent<TestProtoProps> = props => {
  {
    //menuOptions object holds the following content:
    //services: {
    //service1: {request1: {message1Options}}
    //service2: {request2: {message2Options}}
    //}
    const {
      parsedProtoObj,
      serviceOptions,
      setMessageAction,
      data,
      response,
      setServiceAction,
      service,
      setUrlAction,
      setRequestAction,
      request,
      url,
      sendUnaryRequestAction,
      clearResponseEditor,
      proto,
      togglePopup,
      popupStatus,
      changeTheme
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
    };

    const handleRequestClick = (e: any) => {
      clearResponseEditor([]);
      sendUnaryRequestAction("grpc!");
    };

    const handleViewClick = (e: any) => {
      if (proto === "") {
        alert("upload proto file");
      } else {
        togglePopup(!popupStatus);
      }
    };
    //based on state (e.g. "yellow"), pass down
    const toggle = "yellow";

    //CHANGE THEME
    let toggleThemeTestProto = `testProto-${changeTheme}`;
    let toggleThemeSendReqViewProto = `button button-${changeTheme}`;

    return (
      <div id={toggleThemeTestProto}>
        Test Your Proto File:
        <div id="menu-and-view-section">
          <div className="menu-options">
            <input
              className="url-input"
              placeholder="enter server ip address"
              onChange={handleUrlChange}
            ></input>

            <DropdownService
              className="service-dropdown-menu"
              menuOptions={serviceOptions}
              setService={setServiceAction}
              value={service}
            ></DropdownService>

            <DropdownRequest
              className="request-dropdown-menu"
              menuOptions={serviceOptions}
              service={service}
              setRequest={setRequestAction}
              value={request}
              parsedProtoObj={parsedProtoObj}
              setMessageAction={setMessageAction}
            ></DropdownRequest>

            <Button
              className={toggleThemeSendReqViewProto}
              text="Send Request"
              onClick={handleRequestClick}
            />
          </div>
          <div id="handleViewClick">
            <Button
              className={toggleThemeSendReqViewProto}
              text="View Proto File"
              onClick={handleViewClick}
            />
          </div>
        </div>
        <div>
          <Editor
            setMessageAction={setMessageAction}
            data={data}
            response={response}
            changeTheme={changeTheme}
          />
        </div>
      </div>
    );
  }
};

export default TestProto;
