import { INCREMENT, incrementActionType } from '../actions/index'


export interface incrementState {
  count: number
}

const initialState: incrementState = {
  count: 0
}

const incrementReducer: (state: incrementState, action: any) => incrementState = (
  state = initialState, action) => {
    switch (action.type) {
      case INCREMENT:
        return {
          count: state.count + action.payload
        }
    }
    return state
  }

export default incrementReducer;

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
