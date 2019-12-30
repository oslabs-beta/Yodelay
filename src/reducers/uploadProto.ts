import { uploadProtoAction, UPLOAD_PROTO, UPLOAD_PROTO_SUCCESSFUL, SEND_PROTO } from '../actions'
import { setIn } from 'timm'
import { RootState } from '.'

export interface initialProtoStateType {
  proto: any;
  parsedProtosObj: object
}


const initialState: initialProtoStateType = {
  proto: {},
  parsedProtosObj: {}
  // [{parsedProtoObj1}, {parsedProtoObj2}]
  
}

//uploadProto is a function that takes in state and action as params; it returns an updated state object of type initialProtoStateType
//state type is initialProtoStateType; action type is uploadProtoAction

export const uploadProto: (state: initialProtoStateType, action: uploadProtoAction ) => initialProtoStateType = (
  state = initialState, action) => {
    // console.log(action.type)
    switch (action.type) {
     
      case UPLOAD_PROTO: {
        //setIn takes in param1) state object, param2) the key in state that is what we want to update, and param3) the value we want to change 
        return setIn(state, ["proto"], action.payload)
      }

      case UPLOAD_PROTO_SUCCESSFUL: {
        //need to add in functionality to push multiple protoobj to state
        return setIn(state, ["parsedProtosObj"], action.payload)
        
      }
    }
   return state 
  }

  export const protoSelector: (state: RootState) => object = (state) => state.uploadProto.proto
