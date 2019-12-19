import { uploadProtoAction, UPLOAD_PROTO } from '../actions'
import {updateIn, setIn} from 'timm'

export interface initialStateType {
  proto: object
}


const initialState: initialStateType = {
  proto: {}
}

export const test2: (state: initialStateType, action: uploadProtoAction ) => initialStateType = (
  state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_PROTO: {
        return setIn(state, ["proto"], state.proto = action.payload)
      }
    }
   return state 
  }
