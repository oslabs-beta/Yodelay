import {
  uploadProtoAction,
  UPLOAD_PROTO,
  SET_MESSAGE,
  UPLOAD_PROTO_SUCCESSFUL,
  SEND_PROTO,
  SET_SERVICE,
  SET_URL
} from '../actions';
import { setIn } from 'timm';
import { RootState } from '.';

export interface initialProtoStateType {
  messageInput: string;
  serviceInput: string;
  urlInput: string;
  parsedProtosObj: object;
  proto: any;
}

const initialState: initialProtoStateType = {
  messageInput: 'hello',
  serviceInput: '',
  urlInput: '',
  parsedProtosObj: {},
  proto: {}
  // [{parsedProtoObj1}, {parsedProtoObj2}]
};

//uploadProto is a function that takes in state and action as params; it returns an updated state object of type initialProtoStateType
//state type is initialProtoStateType; action type is uploadProtoAction
export const uploadProto: (
  state: initialProtoStateType,
  action: uploadProtoAction
) => initialProtoStateType = (state = initialState, action) => {
  // console.log(action.type)
  switch (action.type) {
    case UPLOAD_PROTO: {
      //setIn takes in param1) state object, param2) the key in state that is what we want to update, and param3) the value we want to change
      return setIn(state, ['proto'], action.payload);
    }
    case SET_MESSAGE: {
      return { ...state, messageInput: action.payload };
    }
    case SET_SERVICE: {
      return { ...state, serviceInput: action.payload };
    }
    case SET_URL: {
      return { ...state, urlInput: action.payload };
    }
    case UPLOAD_PROTO_SUCCESSFUL: {
      //need to add in functionality to push multiple protoobj to state
      return setIn(state, ['parsedProtosObj'], action.payload);
    }
  }

  return state;
};

//makes the proto state and parsedProtosObj state available to connected components
export const protoSelector: (state: RootState) => object = state =>
  state.uploadProto.proto;
export const messageSelector: (state: RootState) => string = state =>
  state.uploadProto.messageInput;
export const serviceSelector: (state: RootState) => string = state =>
  state.uploadProto.serviceInput;
export const urlSelector: (state: RootState) => string = state =>
  state.uploadProto.urlInput;
export const protoObjSelector: (state: RootState) => object = state =>
  state.uploadProto.parsedProtosObj;
