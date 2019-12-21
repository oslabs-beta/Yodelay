export const UPLOAD_PROTO = 'UPLOAD_PROTO'

export interface uploadProto {
  type: typeof UPLOAD_PROTO
  payload: string | ArrayBuffer
}

export type uploadProtoAction = uploadProto

export const uploadProtoActionCreator = (payloadObj: string | ArrayBuffer): uploadProtoAction => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  }
}