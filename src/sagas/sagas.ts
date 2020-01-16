import { call, put, takeLatest, select, take, fork } from "redux-saga/effects";
import { takeEvery, eventChannel } from "redux-saga";
// import moment from 'moment'
import {
  UPLOAD_PROTO,
  uploadProto,
  uploadProtoSuccessfulActionCreator,
  uploadProtoFailedActionCreator,
  loadServiceActionCreator,
  SEND_UNARY_REQUEST,
  sendUnaryRequest,
  setMessageActionCreator,
  displayUnaryResponseActionCreator
} from "../actions/index";
import { json } from "body-parser";
import { stateSelector } from "../reducers/uploadProto";
//Used payload from uploadProto action as an input for the sendProto saga middleware, enabling us to POST the file string to the express server
function* sendProto({ payload }: uploadProto) {
  try {
    // console.log('payload:', payload, 'typeof payload', typeof payload);
    const jsonProtoFile = JSON.stringify(payload);
    const data = yield fetch(`http://localhost:4000/upload`, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain"
      },
      body: jsonProtoFile
    });
    const response = yield data.json();
    //No need to connect() to store; yield put apparently does it for us; that's how we could access the uploadProtoSuccessful action creator -- CHECK
    yield put(uploadProtoSuccessfulActionCreator(response));
    yield put(loadServiceActionCreator(response.services));
  } catch ({ error, status }) {

    const errorMessage = "error in upload saga";
    yield put(uploadProtoFailedActionCreator(errorMessage));
  }
}

function connect() {
  console.log('connect')
  const mySocket = new WebSocket("ws://localhost:4000/websocket", "protocol");
  console.log('mySocket inside of connect', mySocket)
  return mySocket
}

function* subscribe(socket?: any) {
  console.log('subscribe')
  const message = yield take(SEND_UNARY_REQUEST)
  const state = yield select(stateSelector);
  const jsonRequestObj = JSON.stringify({
    url: state.urlInput,
    serviceInput: state.serviceInput,
    messageInput: state.messageInput,
    requestInput: state.requestInput,
    package: state.parsedProtosObj.package,
    protoFile: state.parsedProtosObj.protoFile
  });
  return eventChannel(emit => {
    //listen for messages from server
    socket.onmessage = (message: any) => {
      emit(message);
    };

    return () => {
      socket.close();
    };
  });
}


function* read(socket?: any) {
  const channel = yield call(subscribe, socket);
  console.log('read')

  while (true) {
    let message = yield take(channel);
    console.log('|||||||||||||||||', message)
    // dispatch actions with messages recieved from ws connection with server here
    yield put(
      displayUnaryResponseActionCreator({
        message: message.data,
        responseTime: message.timeStamp
      })
    );
  }
}

function* write(socket?: any) {
  while (true) {
    const message = yield take(SEND_UNARY_REQUEST)
    const state = yield select(stateSelector);
    const jsonRequestObj = JSON.stringify({
      url: state.urlInput,
      serviceInput: state.serviceInput,
      messageInput: state.messageInput,
      requestInput: state.requestInput,
      package: state.parsedProtosObj.package,
      protoFile: state.parsedProtosObj.protoFile,
      wsCommand: state.wsCommand
      // protoDescriptor: state.parsedProtosObj.protoDescriptor
    });
    console.log('write saga message', message)
    console.log('socket inside write', socket)
    socket.send(jsonRequestObj)
  }
}

// function* initializeWebSocketsChannel({ payload }: sendUnaryRequest) {
//   const mySocket = new WebSocket("ws://localhost:4000/websocket", "protocol");
//   const channel = yield call(createEventChannel, mySocket, payload);
//   while (true) {
//     let message = yield take(channel);
//     console.log("-----------", message);
//     // dispatch actions with messages recieved from ws connection with server here
//     yield put(
//       displayUnaryResponseActionCreator({
//         message: message.data,
//         responseTime: message.timeStamp
//       })
//     );
//   }
// }
function* saga() {
  console.log("saga");
  yield takeLatest(UPLOAD_PROTO, sendProto);
  // this needs refactoring as it is for streaming requests
  const socket = yield call(connect)
  yield fork(read, socket)
  yield fork(write, socket)
  // yield takeLatest(SEND_UNARY_REQUEST, initializeWebSocketsChannel);
  // yield takeLatest(SEND_UNARY_REQUEST, unaryRequest);
}
export default saga;
