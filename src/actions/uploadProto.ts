export const UPLOAD_PROTO = 'UPLOAD_PROTO';
export const SEND_PROTO = 'SEND_PROTO';
export const UPLOAD_PROTO_SUCCESSFUL = 'UPLOAD_PROTO_SUCCESSFUL';
export const UPLOAD_PROTO_FAILED = 'UPLOAD_PROTO_FAILED';

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

export type uploadProtoAction = uploadProto;
export type sendProtoAction = sendProto;
export type uploadProtoSuccesfulAction = uploadProtoSuccesful;
export type uploadProtoFailedAction = uploadProtoFailed;

export const uploadProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): uploadProtoAction => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  };
};

export const sendProtoActionCreator = (
  payloadObj: string | ArrayBuffer
): sendProtoAction => {
  return {
    type: SEND_PROTO,
    payload: payloadObj
  };
};

export const uploadProtoSuccesfulActionCreator = (
  payloadObj: object
): uploadProtoSuccesfulAction => {
  return {
    type: UPLOAD_PROTO_SUCCESSFUL,
    payload: payloadObj
  };
};

export const uploadProtoFailedActionCreator = (
  payloadObj: string
): uploadProtoFailedAction => {
  return {
    type: UPLOAD_PROTO_FAILED,
    payload: payloadObj
  };
};
