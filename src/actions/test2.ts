export const UPLOAD_PROTO = 'UPLOAD_PROTO'

export interface uploadProto {
  type: typeof UPLOAD_PROTO
  payload: File
}

export type uploadProtoAction = uploadProto

export const uploadProtoActionCreator = (payloadObj: File): uploadProtoAction => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  }
}