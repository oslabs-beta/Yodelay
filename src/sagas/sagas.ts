import { call, put, takeLatest } from 'redux-saga/effects';
// import moment from 'moment'
import { UPLOAD_PROTO, uploadProtoAction } from '../actions/index';
import { json } from 'body-parser';

// chaining this saga middleware after uploadProto to post the file string to the server
function* sendProto({ payload: type, payload }: uploadProtoAction) {
  // yield call(fetch, '/scores', { method: 'GET', body: { score } })
  try {
    const jsonProtoFile = JSON.stringify(payload);
    yield fetch(`http://localhost:4000/upload`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonProtoFile
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
    console.log('error in upload saga', error, status);
  }
}

function* saga() {
  console.log('saga');
  yield takeLatest(UPLOAD_PROTO, sendProto);
}

export default saga;
