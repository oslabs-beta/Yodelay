import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator,
  clearResponseEditorActionCreator,
  showPopupActionCreator,
  setWsCommandActionCreator,
  startWebsocketActionCreator
} from '../actions';
import { Editor } from './Editor';
import {
  typeResponse,
  typeRequest,
  popupSelector
} from '../reducers/uploadProto';
import { DropdownService } from './DropdownService';
import { DropdownRequest } from './DropdownRequest';
import { Button } from './common/Button';

// sets type for props
interface TestProtoProps {
  parsedProtoObj: object;
  serviceOptions: object;
  data: string;
  service: string;
  url: string;
  response: typeResponse[];
  request: typeRequest;
  wsCommand: string;
  setMessageAction: typeof setMessageActionCreator;
  setServiceAction: typeof setServiceActionCreator;
  setUrlAction: typeof setUrlActionCreator;
  setRequestAction: typeof setRequestActionCreator;
  setWsCommandAction: typeof setWsCommandActionCreator;
  sendUnaryRequestAction: any;
  clearResponseEditor: typeof clearResponseEditorActionCreator;
  proto: string | ArrayBuffer;
  togglePopup: typeof showPopupActionCreator;
  startWebsocketAction: typeof startWebsocketActionCreator;
  popupStatus: boolean;
  changeTheme: string;
}

export const TestProto: FunctionComponent<TestProtoProps> = props => {
  {
    const {
      parsedProtoObj,
      serviceOptions,
      data,
      response,
      service,
      request,
      url,
      proto,
      wsCommand,
      togglePopup,
      popupStatus,
      changeTheme,
      setWsCommandAction,
      setMessageAction,
      setServiceAction,
      setUrlAction,
      setRequestAction,
      sendUnaryRequestAction,
      startWebsocketAction,
      clearResponseEditor
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
    };
    // function that inovokes the action creator to clear response editor, sends grpc request information, and starts websocket connection
    const handleRequestClick = (e: any) => {
      if(url.length === 0) {
        let value = prompt('Please enter IP address');

        if(!value) {
          setUrlAction('');
        } else {
          setUrlAction(value);
        }
      } else {
        clearResponseEditor([]);
        
        setWsCommandAction('sendInit');
        sendUnaryRequestAction(data);
      }
    };
    // function that invokes action creator to push messages
    const handlePushClick = (e: any) => {
      setWsCommandAction('push');
      sendUnaryRequestAction(data);
    };
    // function that invokes action creator to end websocket connection
    const handleEndClick = (e: any) => {
      setWsCommandAction('end');
      sendUnaryRequestAction('End stream');
    };

    const handleViewClick = (e: any) => {
      if (proto === '') {
        alert('upload proto file');
      } else {
        togglePopup(!popupStatus);
      }
    };
    //based on state (e.g. "yellow"), pass down
    const toggle = 'yellow';

    //CHANGE THEME
    let toggleThemeTestProto = `testProto-${changeTheme}`;
    let toggleThemeInputBox = `url-input-${changeTheme}`;
    let toggleThemeSendReqViewProto = `button button-${changeTheme}`;
    let pushButton;
    let endButton;
    let requestButton;
    let showStreamingType;
    let changeThemeBackground;

    if (request.streamType === '' || request.streamType === 'unary') {
      requestButton =  (<Button className='push-button' onClick={handleRequestClick}/>);

    } else if (request.streamType === 'clientStreaming' || request.streamType === 'bidiStreaming') {
      if(wsCommand === '' || wsCommand === 'end') {
        requestButton =  (<Button className='push-button'  onClick={handleRequestClick}/>);
      } else {
        pushButton = (<Button className='push-button' onClick={handlePushClick} />);
        endButton = (<Button className='pause-button' onClick={handleEndClick} />); 
      }
    } else if (request.streamType === 'serverStreaming') {
      if(wsCommand === '' || wsCommand === 'end') {
        requestButton =  (<Button className='push-button'  onClick={handleRequestClick}/>);
      } else {
        endButton = (<Button className='pause-button' onClick={handleEndClick}/>);
        }
      }
    

    if (changeTheme === 'dark-yellow' || changeTheme === 'light-yellow') {
      changeThemeBackground = '#f9c132';
    } else if (changeTheme === 'dark-green') {
      changeThemeBackground = '#50fa7b';
    } else if (changeTheme === 'dark-blue') {
      changeThemeBackground = '#57b5f9';
    }
    if (request.streamType) {
      showStreamingType = (
        <em
          style={{ backgroundColor: changeThemeBackground, color: 'black' }}
        >
          {' '}
          {`Type: ${request.streamType}`}
        </em>
      );
    }

    return (
      <div id={toggleThemeTestProto}>
        Test Your Proto File:
        <div id='menu-and-view-section'>
          <div className='menu-options'>
            <input
              className={toggleThemeInputBox}
              placeholder=' IP address'
              onChange={handleUrlChange}
              value={url}
            ></input>

            <DropdownService
              className='service-dropdown-menu'
              menuOptions={serviceOptions}
              setService={setServiceAction}
              startWebsocket={startWebsocketAction}
              value={service}
            ></DropdownService>

            <DropdownRequest
              className='request-dropdown-menu'
              menuOptions={serviceOptions}
              service={service}
              setRequest={setRequestAction}
              value={request}
              parsedProtoObj={parsedProtoObj}
              setMessageAction={setMessageAction}
            ></DropdownRequest>
            {requestButton}
            {pushButton}
            {endButton}
          </div>
          <div id='handleViewClick'>
            {showStreamingType}
            <Button
              className={toggleThemeSendReqViewProto}
              text='View Proto File'
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
