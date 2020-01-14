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
    //services: {
    //service1: {request1: {1messageOptions}}
    //service2: {request2: {2messageOptions}}
    //}
  } catch ({ error, status }) {
    //error message not working right now
    const errorMessage = "error in upload saga";
    yield put(uploadProtoFailedActionCreator(errorMessage));
    // console.log('error in upload saga', error, status);
  }
}
// payload is not necessary, extract all of state from state selector
// function* unaryRequest({ payload }: sendUnaryRequest) {
//   try {
//     const state = yield select(stateSelector);
//     const jsonRequestObj = JSON.stringify({
//       url: state.urlInput,
//       serviceInput: state.serviceInput,
//       messageInput: state.messageInput,
//       requestInput: state.requestInput,
//       package: state.parsedProtosObj.package,
//       protoFile: state.parsedProtosObj.protoFile,
//       protoDescriptor: state.parsedProtosObj.protoDescriptor
//     });
//     // console.log(
//     //   '-----json-requestObj in unaryRequest saga -----',
//     //   jsonRequestObj
//     // );
//     const data = yield fetch(`http://localhost:4000/service`, {
//       method: "POST",
//       headers: {
//         Accept: "text/plain",
//         "Content-Type": "text/plain"
//       },
//       body: jsonRequestObj
//     });
//     const response = yield data.json();
//     yield put(displayUnaryResponseActionCreator(response));
//     console.log(
//       "here is the respone message returned when a unary request is completed:",
//       response
//     );
//   } catch {
//     console.log("error in unary request");
//   }
// }
// Websockets/Streaming
// function* createEventChannel(mySocket?: any) {
//   console.log("this is the typeof mySocket: ", typeof mySocket);
//   const state = yield select(stateSelector);
//   const jsonRequestObj = JSON.stringify({
//     url: state.urlInput,
//     serviceInput: state.serviceInput,
//     messageInput: state.messageInput,
//     requestInput: state.requestInput,
//     package: state.parsedProtosObj.package,
//     protoFile: state.parsedProtosObj.protoFile
//     // protoDescriptor: state.parsedProtosObj.protoDescriptor
//   });
//   // console.log('jsonRequestObj', jsonRequestObj)
//   return eventChannel(emit => {
//     // listen for messages from server
//     mySocket.onmessage = (message: any) => {
//       console.log("message, ", message);
//       emit(message);
//     };
//     // when connection is first established
//     mySocket.onopen = function(event: any) {
//       ""
//       mySocket.send(jsonRequestObj);
//     };
//     return () => {
//       mySocket.close();
//     };
//   });
// } 

// function connect() {
//   const mySocket = new WebSocket("ws://localhost:4000/websocket", "protocol");
//   return mySocket;
// }

// function* initializeWebSocketsChannel({ payload }: sendUnaryRequest) {
  // const mySocket = new WebSocket("ws://localhost:4000/websocket", "protocol");

//   function createEventChannel(mySocket?: any) {
//     console.log("this is the typeof mySocket: ", typeof mySocket);
//     const state = yield select(stateSelector);
//     const jsonRequestObj = JSON.stringify({
//       url: state.urlInput,
//       serviceInput: state.serviceInput,
//       messageInput: state.messageInput,
//       requestInput: state.requestInput,
//       package: state.parsedProtosObj.package,
//       protoFile: state.parsedProtosObj.protoFile
//       // protoDescriptor: state.parsedProtosObj.protoDescriptor
//     });
//     // console.log('jsonRequestObj', jsonRequestObj)
//     return eventChannel(emit => {
//       // listen for messages from server
//       mySocket.onmessage = (message: any) => {
//         console.log("message, ", message);
//         emit(message);
//       };
//       // when connection is first established
//       mySocket.onopen = function(event: any) {
//         ""
//         mySocket.send(jsonRequestObj);
//       };
//       return () => {
//         mySocket.close();
//       };
//     });
//     const response = yield data.json();
//     yield put(displayUnaryResponseActionCreator(response));
//     console.log(
//       "here is the respone message returned when a unary request is completed:",
//       response
//     );
//   } catch {
//     console.log("error in unary request");
//   }
// }
// // Websockets/Streaming
// function* createEventChannel(mySocket?: any) {
//   console.log("this is the typeof mySocket: ", typeof mySocket);
//   const state = yield select(stateSelector);
//   const jsonRequestObj = JSON.stringify({
//     url: state.urlInput,
//     serviceInput: state.serviceInput,
//     messageInput: state.messageInput,
//     requestInput: state.requestInput,
//     package: state.parsedProtosObj.package,
//     protoFile: state.parsedProtosObj.protoFile
//     // protoDescriptor: state.parsedProtosObj.protoDescriptor
//   });
//   // console.log('jsonRequestObj', jsonRequestObj)
//   return eventChannel(emit => {
//     // listen for messages from server
//     mySocket.onmessage = (message: any) => {
//       console.log("message, ", message);
//       emit(message);
//     };
//     // when connection is first established
//     mySocket.onopen = function (event: any) {
//       mySocket.send(jsonRequestObj);
//     };
//     return () => {
//       mySocket.close();
//     };
//   });
// }

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
    // protoDescriptor: state.parsedProtosObj.protoDescriptor
  });
  return eventChannel(emit => {
    console.log('eventChannel')

    // const update = (data: any) => {
    //   console.log('listened data: ', data)
    //   return emit(data)
    // }
    //listen for messages from server
    socket.onmessage = (message: any) => {
      console.log("socket.onmessage, ", message);
      emit(message);
    };
    // // when connection is first established
    // socket.onopen = function (event: any) {
    //   socket.send(jsonRequestObj);
    // };
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
    console.log("-----------message inside read saga", message);
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
      type: state.wsCommandType
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
