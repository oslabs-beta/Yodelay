import { INCREMENT, incrementActions, DECREMENT } from '../actions'
import {updateIn, setIn} from 'timm'
import { RootState } from '.'

export interface testState {
  count: number
}

const initialState: testState = {
  count: 0
}

//this reducer can only take in actions of type increment actions
export const test: (state: testState, action: incrementActions) => testState = (
  state = initialState, action) => {
    switch (action.type) {
      case INCREMENT:{
        //setIn takes in param1) state object, param2) the key in state that is what we want to update, and param3) the value we want to change 
        return setIn(state, ["count"], state.count+1)
        // {
        //   count: state.count + action.payload
        // }
      }

      case DECREMENT: {
        //updateIn -- the only thing that changes is that param3 is a function
        return updateIn(state, ["count"], (prevCount) => prevCount-1)
      }
      
    }
    return state
  }


// selectors
export const countSelector: (state: RootState)=> number = (state) => state.test.count 

//// OLD
// function incrementReducer (
//   state = initialState,
//   action: incrementActionType
// ): incrementState {
//   switch (action.type) {
//     case INCREMENT:
//       return {
//         count: state.count + action.payload
//       }
//   }
// }
