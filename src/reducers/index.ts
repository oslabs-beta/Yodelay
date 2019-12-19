import { combineReducers } from "redux";
// needs clarifying -- how does it recognizes increment and why does it need an alias
import increment, * as fromIncrement from './incrementReducer'

export interface RootState {
  increment: 
  fromIncrement.incrementState
}

// Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore
const rootReducer = combineReducers ({
  increment
})

export default rootReducer;