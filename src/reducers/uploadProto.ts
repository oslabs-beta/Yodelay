import { uploadProtoAction, UPLOAD_PROTO, SET_REQUEST, setRequestAction } from '../actions'
import { setIn } from 'timm'
import { RootState } from '.'

export interface initialStateType {
  proto: any
  setRequest: any 
}


const initialState: initialStateType = {
  proto: {},
  setRequest:{} 
}

export const uploadProto: (state: initialStateType, action: uploadProtoAction | setRequestAction) => initialStateType = (
  state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_PROTO: {
        return setIn(state, ["proto"], action.payload)
      }

      case SET_REQUEST: {
        return setIn(state, ["setRequest"], action.payload)
      }
    }
   return state 
  }

  export const protoSelector: (state: RootState) => object = (state) => state.uploadProto.proto
  export const requestSelector: (state: RootState) => object = (state) => state.uploadProto.setRequest
