import { call, put, takeLatest } from 'redux-saga/effects';
// import moment from 'moment'
import { UPLOAD_PROTO, uploadProto, uploadProtoSuccesfulActionCreator, uploadProtoFailedActionCreator, loadServiceActionCreator} from '../actions/index';
import { json } from 'body-parser';


//Used payload from uploadProto action as an input for the sendProto saga middleware, enabling us to POST the file string to the express server

function* sendProto({ payload }: uploadProto) {

  try {
    console.log("payload:", payload, "typeof payload", typeof payload)
    const jsonProtoFile = JSON.stringify(payload);
    const data = yield fetch(`http://localhost:4000/upload`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonProtoFile
    })
    

    const response = yield data.json()
    console.log('here is the protoObject returned when a protoFile is uploaded:', response);

    //No need to connect() to store; yield put apparently does it for us; that's how we could access the uploadProtoSuccessful action creator -- CHECK
    yield put (uploadProtoSuccesfulActionCreator(response))

    yield put (loadServiceActionCreator(response.services))
  } catch ({ error, status }) {
    //error message not working right now
    const errorMessage = 'error in upload saga'
    yield put(uploadProtoFailedActionCreator(errorMessage));
    // console.log('error in upload saga', error, status);
  }
}



function* saga() {
  console.log('saga');
  yield takeLatest(UPLOAD_PROTO, sendProto);

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