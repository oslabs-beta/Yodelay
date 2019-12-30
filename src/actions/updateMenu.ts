//Define action type
export const LOAD_SERVICE_OPTIONS = 'LOAD_SERVICE_OPTIONS '

//Define shape of action type
export interface loadServiceOptions {
  type: typeof LOAD_SERVICE_OPTIONS;
  payload: string[]
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type loadMenuAction = loadServiceOptions 

export const loadMenuActionActionCreator = (
  payloadObj: string[]
): loadServiceOptions => {
  return {
    type: LOAD_SERVICE_OPTIONS,
    payload: payloadObj
  };
};

