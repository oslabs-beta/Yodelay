export const UPLOAD_PROTO = 'UPLOAD_PROTO'

export interface uploadProto {
  type: typeof UPLOAD_PROTO
  payload: object
}

export type uploadProtoAction = uploadProto

export const uploadProtoActionCreator = (payloadObj: object): uploadProtoAction => {
  return {
    type: UPLOAD_PROTO,
    payload: payloadObj
  }
}