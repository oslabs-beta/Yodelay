//Define action type
export const UPLOAD_PROTO = 'UPLOAD_PROTO';
export const SEND_PROTO = 'SEND_PROTO';
export const UPLOAD_PROTO_SUCCESSFUL = 'UPLOAD_PROTO_SUCCESSFUL';
export const UPLOAD_PROTO_FAILED = 'UPLOAD_PROTO_FAILED';

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

export interface uploadProtoSuccesful {
  type: typeof UPLOAD_PROTO_SUCCESSFUL;
  payload: object;
}

export interface uploadProtoFailed {
  type: typeof UPLOAD_PROTO_FAILED;
  payload: string;
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type uploadProtoAction = uploadProto | sendProto | uploadProtoSuccesful | uploadProtoFailed;


export const uploadProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): uploadProto => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  };
};

export const sendProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): sendProto => {
  return {
    type: SEND_PROTO,
    payload: payloadObj
  };
};

export const uploadProtoSuccesfulActionCreator = (
  payloadObj: object
): uploadProtoSuccesful => {
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
