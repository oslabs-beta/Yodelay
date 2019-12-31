export const UPLOAD_PROTO = 'UPLOAD_PROTO'
export const SEND_PROTO = 'SEND_PROTO'

export const SET_MESSAGE = 'SET_MESSAGE'


export interface uploadProto {
  type: typeof UPLOAD_PROTO
  payload: string | ArrayBuffer
}

export interface sendProto {
  type: typeof SEND_PROTO
  payload: string | ArrayBuffer 
}

export interface setMessage {
  type: typeof SET_MESSAGE
  payload: string
}


export type uploadProtoAction = uploadProto
export type sendProtoAction = sendProto
export type setMessageAction = setMessage


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

export const setMessageActionCreator = (payloadObj: string): setMessageAction => {
  return {
    type: SET_MESSAGE,
    payload: payloadObj
  }
}