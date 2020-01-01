import { call, put, takeLatest, select } from 'redux-saga/effects';
// import moment from 'moment'
import {
  UPLOAD_PROTO,
  uploadProto,
  uploadProtoSuccesfulActionCreator,
  uploadProtoFailedActionCreator,
  loadServiceActionCreator,
  SEND_UNARY_REQUEST,
  sendUnaryRequest
} from '../actions/index';
import { json } from 'body-parser';
import { stateSelector } from '../reducers/uploadProto';

//Used payload from uploadProto action as an input for the sendProto saga middleware, enabling us to POST the file string to the express server

function* sendProto({ payload }: uploadProto) {
  try {
    console.log('payload:', payload, 'typeof payload', typeof payload);
    const jsonProtoFile = JSON.stringify(payload);
    const data = yield fetch(`http://localhost:4000/upload`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonProtoFile
    });

    const response = yield data.json();
    console.log(
      'here is the protoObject returned when a protoFile is uploaded:',
      response
    );

    //No need to connect() to store; yield put apparently does it for us; that's how we could access the uploadProtoSuccessful action creator -- CHECK
    yield put(uploadProtoSuccesfulActionCreator(response));

    yield put(loadServiceActionCreator(response.services));
    //services: {
    //service1: {request1: {1messageOptions}}
    //service2: {request2: {2messageOptions}}
    //}
  } catch ({ error, status }) {
    //error message not working right now
    const errorMessage = 'error in upload saga';
    yield put(uploadProtoFailedActionCreator(errorMessage));
    // console.log('error in upload saga', error, status);
  }
}

function* unaryRequest({ payload }: sendUnaryRequest) {
  try {
    const state = yield select(stateSelector);

    const jsonRequestObj = JSON.stringify({
      url: state.urlInput,
      serviceInput: state.serviceInput,
      messageInput: state.messageInput,
      requestInput: state.requestInput,
      package: state.parsedProtosObj.package,
      protoFile: state.parsedProtosObj.protoFile,
      protoDescriptor: state.parsedProtosObj.protoDescriptor
    });

    // console.log(
    //   '-----jsonrequestObj in unaryRequest saga -----',
    //   jsonRequestObj
    // );

    const data = yield fetch(`http://localhost:4000/service`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonRequestObj
    });

    const response = yield data.json();
    console.log(
      'here is the respone message returned when a unary request is completed:',
      response
    );
  } catch {
    console.log('error in unary request');
  }
}

function* saga() {
  console.log('saga');
  yield takeLatest(UPLOAD_PROTO, sendProto);
  yield takeLatest(SEND_UNARY_REQUEST, unaryRequest);
}

export default saga;

// todo: .then response here! send back with service and message fields filled out:
// todo  {
// todo     "port": "0.0.0.0:50051",
// todo     "packageName": "WorLd",
// todo     "service": "YodelayAPI",
// todo     "message": "SayHello",
// todo     "protoObject": "syntax = 'proto3'; package helloaworld; service YodelayAPI { rpc SayHello (HelloRequest) returns (HelloReply) {} }message HelloRequest { string port = 1; string packageName = 2; string service = 3; string message = 4; string protoObject = 5; } message HelloReply { string message = 1; }"
// todo }
