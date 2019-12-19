// Consolidate actionTypes with this file. Rename this file from actionCreators to increment.ts (we should mirror increment.ts in the reducers file). Remove below line
// import {INCREMENT} from './actionTypes'

/****************************create action type*************************** */
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'


/*****************************************define types for action obj************** */

// defines 
export interface incrementAction {
  type: typeof INCREMENT
  payload: number
}

export interface decrementAction {
  type: typeof DECREMENT
  payload: number
}

// we combine the increment and decrement interface types into one type so that this one type can be used elsewhere, like in /reducers/increment
export type incrementActions = incrementAction | decrementAction 

/**********************************makes available outside of file ********** */
//we can get rid of export type by just exporting the interface. Remove below line
// export type incrementActionType = incrementAction

export const incrementActionCreator = (incrementNum: number): incrementAction => {
  return {
    type: INCREMENT,
    payload: incrementNum
  }
}

export const decrementActionCreator = (decrementNum: number): decrementAction => {
  return {
    type: DECREMENT,
    payload: decrementNum
  }
}

