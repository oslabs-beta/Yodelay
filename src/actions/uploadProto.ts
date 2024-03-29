import { typeResponse } from "../reducers/uploadProto";

//Define action type
export const UPLOAD_PROTO = "UPLOAD_PROTO";
export const SEND_PROTO = "SEND_PROTO";
export const UPLOAD_PROTO_SUCCESSFUL = "UPLOAD_PROTO_SUCCESSFUL";
export const UPLOAD_PROTO_FAILED = "UPLOAD_PROTO_FAILED";
export const SEND_UNARY_REQUEST = "SEND_UNARY_REQUEST";
export const SET_MESSAGE = "SET_MESSAGE";
export const SET_SERVICE = "SET_SERVICE";
export const SET_URL = "SET_URL";
export const SET_REQUEST = "SET_REQUEST";
export const DISPLAY_UNARY_RESPONSE = "DISPLAY_UNARY_RESPONSE";
export const CLEAR_RESPONSE_EDITOR = "CLEAR_RESPONSE_EDITOR";
export const SHOW_POPUP = "SHOW_POPUP";
export const SET_WS_COMMAND = "SET_WS_COMMAND";
export const START_WEBSOCKET = "START_WEBSOCKET";

//Define shape of action type
//Arraybuffer is an array of bytes, representing a generic, fixed-length raw binary data buffer
export interface uploadProto {
  type: typeof UPLOAD_PROTO;
  payload: string | ArrayBuffer;
}

export interface sendProto {
  type: typeof SEND_PROTO;
  payload: string | ArrayBuffer;
}

export interface uploadProtoSuccessful {
  type: typeof UPLOAD_PROTO_SUCCESSFUL;
  payload: object;
}

export interface sendUnaryRequest {
  type: typeof SEND_UNARY_REQUEST;
  payload: any;
}

export interface displayUnaryResponse {
  type: typeof DISPLAY_UNARY_RESPONSE;
  payload: typeResponse;
}

export interface setMessage {
  type: typeof SET_MESSAGE;
  payload: string;
}

export interface setService {
  type: typeof SET_SERVICE;
  payload: string;
}

export interface setUrl {
  type: typeof SET_URL;
  payload: string;
}

export interface setRequest {
  type: typeof SET_REQUEST;
  payload: object;
}

export interface uploadProtoFailed {
  type: typeof UPLOAD_PROTO_FAILED;
  payload: string;
}

export interface clearResponseEditor {
  type: typeof CLEAR_RESPONSE_EDITOR;
  payload: typeResponse[];
}

export interface showPopup {
  type: typeof SHOW_POPUP;
  payload: boolean;
}

export interface setWsCommand {
  type: typeof SET_WS_COMMAND;
  payload: string;
}

export interface startWebsocket {
  type: typeof START_WEBSOCKET;
  payload: string;
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type uploadProtoAction =
  | uploadProto
  | sendProto
  | uploadProtoSuccessful
  | uploadProtoFailed
  | setMessage
  | setService
  | setUrl
  | setRequest
  | sendUnaryRequest
  | displayUnaryResponse
  | clearResponseEditor
  | showPopup
  | setWsCommand
  | startWebsocket


export const uploadProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): uploadProto => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  };
};

// Do we ever use sendProtoActionCreator?
export const sendProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): sendProto => {
  return {
    type: SEND_PROTO,
    payload: payloadObj
  };
};

export const uploadProtoSuccessfulActionCreator = (
  payloadObj: object
): uploadProtoSuccessful => {
  return {
    type: UPLOAD_PROTO_SUCCESSFUL,
    payload: payloadObj
  };
};

export const uploadProtoFailedActionCreator = (
  payloadObj: string
): uploadProtoFailed => {
  return {
    type: UPLOAD_PROTO_FAILED,
    payload: payloadObj
  };
};

export const sendUnaryRequestActionCreator = (
  payloadObj: any
): sendUnaryRequest => {
  return {
    type: SEND_UNARY_REQUEST,
    payload: payloadObj
  };
};

export const displayUnaryResponseActionCreator = (
  payloadObj: any
): displayUnaryResponse => {
  return {
    type: DISPLAY_UNARY_RESPONSE,
    payload: payloadObj
  };
};

export const setMessageActionCreator = (payloadObj: string): setMessage => {
  return {
    type: SET_MESSAGE,
    payload: payloadObj
  };
};

export const setServiceActionCreator = (payloadObj: string): setService => {
  return {
    type: SET_SERVICE,
    payload: payloadObj
  };
};

export const setUrlActionCreator = (payloadObj: string): setUrl => {
  return {
    type: SET_URL,
    payload: payloadObj
  };
};

export const setRequestActionCreator = (payloadObj: object): setRequest => {
  return {
    type: SET_REQUEST,
    payload: payloadObj
  };
};

export const clearResponseEditorActionCreator = (
  payloadObj: typeResponse[]
): clearResponseEditor => {
  return {
    type: CLEAR_RESPONSE_EDITOR,
    payload: payloadObj
  };
};

export const showPopupActionCreator = (payloadObj: boolean): showPopup => {
  return {
    type: SHOW_POPUP,
    payload: payloadObj
  };
};

export const setWsCommandActionCreator = (
  payloadObj: string
): setWsCommand => {
  return {
    type: SET_WS_COMMAND,
    payload: payloadObj
  };
};

export const startWebsocketActionCreator = (
  payloadObj: string
): startWebsocket => {
  return {
    type: START_WEBSOCKET,
    payload: payloadObj
  }
}
