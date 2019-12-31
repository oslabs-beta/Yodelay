export const UPLOAD_PROTO = 'UPLOAD_PROTO'
export const SEND_PROTO = 'SEND_PROTO'

export const SET_REQUEST = 'SET_REQUEST'


export interface uploadProto {
  type: typeof UPLOAD_PROTO
  payload: string | ArrayBuffer
}

export interface sendProto {
  type: typeof SEND_PROTO
  payload: string | ArrayBuffer 
}

export interface setRequest {
  type: typeof SET_REQUEST
  payload: string
}


export type uploadProtoAction = uploadProto
export type sendProtoAction = sendProto
export type setRequestAction = setRequest


export const uploadProtoActionCreator = (payloadObj: string | ArrayBuffer): uploadProtoAction => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  }
}

export const sendProtoActionCreator = (payloadObj: string | ArrayBuffer): sendProtoAction => {
  return {
    type:SEND_PROTO,
    payload: payloadObj
  }
}

export const setRequestActionCreator = (payloadObj: string): setRequestAction => {
  return {
    type: SET_REQUEST,
    payload: payloadObj
  }
}