// // import categories, * as fromCategories from "./categories";
// import { combineReducers } from "redux";
// import {increase}
// // export interface RootState {
// // }
// const reducers = combineReducers({
//   increaseCount: 
// });
// export default reducers;

import { combineReducers } from "redux";
import increment, * as fromIncrement from './incrementReducer'

export interface RootState {
  increment: 
  fromIncrement.incrementState
}

const rootReducer = combineReducers ({
  increment
})

export default rootReducer;