import React, { FunctionComponent} from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator,
  clearResponseEditorActionCreator
} from "../actions";
import { Editor } from "./Editor";
import { typeResponse, typeRequest } from "../reducers/uploadProto";
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
      clearResponseEditor
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
    };

    const handleRequestClick = (e: any) => {
      clearResponseEditor([]);
      sendUnaryRequestAction("grpc!");
    };

    return (
      <div id="testProto">
        Test Your Proto File:
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
          ></DropdownRequest>

          <Button
            className="button"
            text="Send Request"
            onClick={handleRequestClick}
          />
        </div>
        <div>
          <Editor
            setMessageAction={setMessageAction}
            data={data}
            response={response}
          />
        </div>
      </div>
    );
  }
};

export default TestProto;
