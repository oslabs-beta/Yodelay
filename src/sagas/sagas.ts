import { call, put, takeLatest } from 'redux-saga/effects';
// import moment from 'moment'
import { UPLOAD_PROTO, uploadProto } from '../actions/index';
import { json } from 'body-parser';

//Process: User clicks "upload proto" button > triggers uploadProto action creator > dispatches action > reducer returns new state object > updates store 
//Used payload from uploadProto action as an input for the sendProto saga middleware, enabling us to POST the file string to the express server

function* sendProto({ payload }: uploadProto) {

  try {
    console.log("payload:", payload, "typeof payload", typeof payload)
    const jsonProtoFile = JSON.stringify(payload);
    yield fetch(`http://localhost:4000/upload`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonProtoFile
    })
      .then(response => response.json())
      .then(data => {
        // console.log('here is the protoObject returned when a protoFile is uploaded:', data);
        //Q: 
        put({
          type: 'UPLOAD_PROTO_SUCCESSFUL',
          payload: data
        });
      });

    // todo: .then response here! send back with service and message fields filled out:
    // todo  {
    // todo     "port": "0.0.0.0:50051",
    // todo     "packageName": "WorLd",
    // todo     "service": "YodelayAPI",
    // todo     "message": "SayHello",
    // todo     "protoObject": "syntax = 'proto3'; package helloaworld; service YodelayAPI { rpc SayHello (HelloRequest) returns (HelloReply) {} }message HelloRequest { string port = 1; string packageName = 2; string service = 3; string message = 4; string protoObject = 5; } message HelloReply { string message = 1; }"
    // todo }
  } catch ({ error, status }) {
    yield put({ type: 'UPLOAD_PROTO_FAILED', payload: 'error in upload saga' });
    // console.log('error in upload saga', error, status);
  }
}

function* saga() {
  console.log('saga');
  yield takeLatest(UPLOAD_PROTO, sendProto);
}

export default saga;
