import { changeThemeAction, CHANGE_THEME } from "../actions";
import { setIn } from "timm";
import { RootState } from ".";

export interface initialThemeStateType {
  theme: string;
}

const initialState: initialThemeStateType = {
  theme: "dark-yellow"
  //payload will change based on theme: dark-yellow | light-yellow | dark-green | dark-blue
};

export const changeTheme: (
  state: initialThemeStateType,
  action: changeThemeAction
) => initialThemeStateType = (state = initialState, action) => {
  // console.log(action.type)
  switch (action.type) {
    case CHANGE_THEME: {
      //setIn takes in param1) state object, param2) the key in state that is what we want to update, and param3) the value we want to change
      return setIn(state, ["theme"], action.payload);
    }
  }
  return state;
};

export const themeSelector: (state: RootState) => string = state =>
  state.changeTheme.theme;
