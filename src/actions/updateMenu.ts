
//Define action type
export const LOAD_SERVICE_OPTIONS = 'LOAD_SERVICE_OPTIONS '
export const LOAD_REQUEST_OPTIONS = 'LOAD_REQUEST_OPTIONS '



//Define shape of action type
export interface loadServiceOptions {
  type: typeof LOAD_SERVICE_OPTIONS;
  payload: string[]
}

export interface loadRequestOptions {
  type: typeof LOAD_REQUEST_OPTIONS;
  payload: string[]
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type loadMenuAction = loadServiceOptions | loadRequestOptions

export const loadServiceActionCreator = (
  payloadObj: string[]
): loadServiceOptions => {
  return {
    type: LOAD_SERVICE_OPTIONS,
    payload: payloadObj
  };
};

export const loadRequestActionCreator = (
  payloadObj: string[]
): loadRequestOptions => {
  return {
    type: LOAD_REQUEST_OPTIONS,
    payload: payloadObj
  };
};

