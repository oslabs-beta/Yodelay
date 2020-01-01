import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator
} from '../actions';
import { Editor } from './Editor';
import { typeResponse } from '../reducers/uploadProto';
import { DropdownService } from './DropdownService';
import { DropdownRequest } from './DropdownRequest';

// sets type for props
interface TestProtoProps {
  setMessageAction: typeof setMessageActionCreator;
  data: string;
  response: typeResponse;
  setServiceAction: typeof setServiceActionCreator;
  service: string;
  setUrlAction: typeof setUrlActionCreator;
  url: string;
  setRequestAction: typeof setRequestActionCreator;
  request: string;
  serviceOptions: object;
}

export const TestProto: FunctionComponent<TestProtoProps> = props => {
  {
    //menuOptions object holds the following content:
    //services: {
    //service1: {request1: {message1Options}}
    //service2: {request2: {message2Options}}
    //}
    const {
      serviceOptions,
      setMessageAction,
      data,
      response,
      setServiceAction,
      service,
      setUrlAction,
      setRequestAction,
      request,
      url
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
    };

    return (
      <div style={{ border: 'solid 1px green', flexGrow: 2 }}>
        TestProto
        <div id="menu-options">
          <input
            id="urlInput"
            placeholder="enter server ip address"
            onChange={handleUrlChange}
          ></input>

          <DropdownService
            id="service-dropdown-menu"
            menuOptions={serviceOptions}
            setService={setServiceAction}
            value={service}
          ></DropdownService>

          <DropdownRequest
            id="request-dropdown-menu"
            menuOptions={serviceOptions}
            service={service}
            setRequest={setRequestAction}
            value={request}
          ></DropdownRequest>
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
