import { uploadProtoAction, UPLOAD_PROTO, SET_MESSAGE, setMessageAction } from '../actions'
import { setIn } from 'timm'
import { RootState } from '.'

export interface initialStateType {
  proto: any
  data: string
  messageInput: string 
}


const initialState: initialStateType = {
  proto: {},
  data: "hello",
  messageInput: "hello"

}

export const uploadProto: (state: initialStateType, action: uploadProtoAction | setMessageAction) => initialStateType = (
  state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_PROTO: {
        return setIn(state, ["proto"], action.payload)
      }

      case SET_MESSAGE: {
        // console.log(action.payload)
        return { ...state, messageInput: action.payload }
      }
    }
   return state 
  }

  export const protoSelector: (state: RootState) => object = (state) => state.uploadProto.proto
  export const dataSelector: (state: RootState) => string = (state) => state.uploadProto.data
  export const messageSelector: (state: RootState) => string = (state) => state.uploadProto.messageInput
