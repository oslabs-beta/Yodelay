import {INCREMENT} from './actionTypes'

/*****************************************action interface ************** */
interface incrementAction {
  type: typeof INCREMENT
  payload: number
}

/**********************************makes available outside of file ********** */

export type incrementActionType = incrementAction

export const incrementActionCreator = (incrementNum: number): incrementActionType => {
  return {
    type: INCREMENT,
    payload: incrementNum
  }
}
