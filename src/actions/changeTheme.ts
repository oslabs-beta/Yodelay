//Define action type

export const CHANGE_THEME = "CHANGE_THEME";

//Define shape of action type
export interface changeTheme {
  type: typeof CHANGE_THEME;
  payload: string;
}

//Groups all action types so that they can be referenced in the reducer files via one umbrella type --  basically, we're trying to make sure that any given reducer can only accept certain action types in the switch/case statement
export type changeThemeAction = changeTheme;

export const changeThemeActionCreator = (payloadObj: string): changeTheme => {
  return {
    type: CHANGE_THEME,
    payload: payloadObj
  };
};
