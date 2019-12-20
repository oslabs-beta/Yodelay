import { combineReducers } from "redux";
// needs clarifying -- how does it recognizes increment and why does it need an alias
import {test, testState} from './test'
import {test2, initialStateType} from './test2'

export interface RootState {
  test: testState
  test2: initialStateType
}

// Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore
const rootReducer = combineReducers ({
  test,
  test2
})

export default rootReducer;