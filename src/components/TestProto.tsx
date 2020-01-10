import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator,
  showPopupActionCreator
} from '../actions';
import { Editor } from './Editor';
import { typeResponse, popupSelector } from '../reducers/uploadProto';
import { DropdownService } from './DropdownService';
import { DropdownRequest } from './DropdownRequest';
import { Button } from './common/Button';
import { Popup } from './Popup'


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
  sendUnaryRequestAction: any;
  proto: object;
  togglePopup: typeof showPopupActionCreator;
  popupStatus: boolean;

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
      url,
      sendUnaryRequestAction,
      proto,
      togglePopup,
      popupStatus
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
    };

    const handleRequestClick = (e: any) => {
      sendUnaryRequestAction('grpc!');
    };

    const handleViewClick = (e: any) => {
      if (Object.entries(proto).length === 0 && proto.constructor === Object) {
        alert("upload proto file")
      } else {
        togglePopup(!popupStatus);
      }
      console.log('FROM HANDLE VIEW CLICK', proto)
      console.log('TYPEOF PROTO', typeof proto)
      // alert(proto);
    };

    return (
      <div id = "testProto">
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
              setMessageAction={setMessageAction}
            ></DropdownRequest>

            <Button className = "button" text="Send Request" onClick={handleRequestClick} />
          </div>
          <div id="handleViewClick">
            <Button className = "button" text="View Proto File" onClick={handleViewClick} />
          </div>
        </div>
        <div>
          {/* <Popup popup={popupStatus} toggle={togglePopup} proto={proto}></Popup> */}
          <div>
            <Editor
              setMessageAction={setMessageAction}
              data={data}
              response={response}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default TestProto;
