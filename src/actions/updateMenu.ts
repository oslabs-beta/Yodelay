
//Define action type
export const LOAD_SERVICE_OPTIONS = 'LOAD_SERVICE_OPTIONS '
export const LOAD_REQUEST_OPTIONS = 'LOAD_REQUEST_OPTIONS '



//Define shape of action type
export interface loadServiceOptions {
  type: typeof LOAD_SERVICE_OPTIONS;
  payload: object
}

export interface loadRequestOptions {
  type: typeof LOAD_REQUEST_OPTIONS;
  payload: object
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type loadMenuAction = loadServiceOptions | loadRequestOptions

export const loadServiceActionCreator = (
  payloadObj: object
): loadServiceOptions => {
  return {
    type: LOAD_SERVICE_OPTIONS,
    payload: payloadObj
  };
};

export const loadRequestActionCreator = (
  payloadObj: object
): loadRequestOptions => {
  return {
    type: LOAD_REQUEST_OPTIONS,
    payload: payloadObj
  };
};

