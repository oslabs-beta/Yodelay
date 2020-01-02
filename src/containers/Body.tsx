import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import TestProto from '../components/TestProto';
import Settings from '../components/Settings';
import { Route } from 'react-router';
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator,
  setRequestActionCreator,
  sendUnaryRequestActionCreator
} from '../actions';
import {
  messageSelector,
  serviceSelector,
  urlSelector,
  requestSelector,
  responseSelector,
  typeResponse
} from '../reducers/uploadProto';
import { RootState } from '../reducers';

// sets type for props
interface BodyProps {
  setMessageAction: typeof setMessageActionCreator;
  selectMessage: string;
  setServiceAction: typeof setServiceActionCreator;
  selectService: string;
  setUrlAction: typeof setUrlActionCreator;
  selectUrl: string;
  setRequestAction: typeof setRequestActionCreator;
  selectRequest: string;
  serviceOptions: object;
  selectResponse: typeResponse;
  sendUnaryRequestAction?: typeof sendUnaryRequestActionCreator;
}

export const Body: FunctionComponent<BodyProps> = props => {
  {
    const {
      setMessageAction,
      selectMessage,
      setServiceAction,
      selectService,
      setUrlAction,
      selectUrl,
      setRequestAction,
      selectRequest,
      serviceOptions,
      selectResponse,
      sendUnaryRequestAction
    } = props;

    return (
      <div style={{ border: 'solid 1px green', flexGrow: 2 }}>
        Body
        <Route exact path="/">
          <TestProto
            setMessageAction={setMessageAction}
            data={selectMessage}
            setServiceAction={setServiceAction}
            service={selectService}
            setUrlAction={setUrlAction}
            url={selectUrl}
            setRequestAction={setRequestAction}
            request={selectRequest}
            serviceOptions={serviceOptions}
            response={selectResponse}
            sendUnaryRequestAction={sendUnaryRequestAction}
          >
            Test Proto
          </TestProto>
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
    selectMessage: messageSelector(state),
    selectService: serviceSelector(state),
    selectUrl: urlSelector(state),
    selectRequest: requestSelector(state),
    selectResponse: responseSelector(state)
  }),
  {
    setMessageAction: setMessageActionCreator,
    setServiceAction: setServiceActionCreator,
    setUrlAction: setUrlActionCreator,
    setRequestAction: setRequestActionCreator,
    sendUnaryRequestAction: sendUnaryRequestActionCreator
  }
)(Body);
