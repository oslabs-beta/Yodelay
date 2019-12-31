import { combineReducers } from "redux";
// needs clarifying -- how does it recognizes increment and why does it need an alias
import {test, testState} from './test'
import {uploadProto, initialProtoStateType} from './uploadProto'
import {updateMenu, initialMenuStateType} from './updateMenu'


export interface RootState {
  test: testState
  uploadProto: initialProtoStateType
  updateMenu: initialMenuStateType
}

// Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore
const rootReducer = combineReducers ({
  test,
  uploadProto, 
  updateMenu
})

export default rootReducer;