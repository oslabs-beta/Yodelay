import { combineReducers } from "redux";
// needs clarifying -- how does it recognizes increment and why does it need an alias
import {test, testState} from './test'

export interface RootState {
  test: testState
}

// Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore
const rootReducer = combineReducers ({
  test
})

export default rootReducer;