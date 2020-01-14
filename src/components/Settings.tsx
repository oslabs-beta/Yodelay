import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from "./common/Button";
import { changeTheme, themeSelector } from "../reducers/changeTheme";
import { RootState } from "../reducers";
import { changeThemeActionCreator } from "../actions";

// sets type for props
interface SettingsProps {
  changeThemeAction: typeof changeThemeActionCreator;
  changeTheme: string;
}

export const Settings: FunctionComponent<SettingsProps> = props => {
  {
    const { changeThemeAction, changeTheme } = props;

    const toggleDarkYellow = () => {
      changeThemeAction("dark-yellow");
    };
    const toggleLightYellow = () => {
      changeThemeAction("light-yellow");
    };
    const toggleDarkGreen = () => {
      changeThemeAction("dark-green");
    };
    const toggleDarkBlue = () => {
      changeThemeAction("dark-blue");
    };

    return (
      <div>
        ⚡⚙ COMING SOON ⚙⚡
        {/* Dark Yellow Theme */}
        <Button
          className="button-dark-yellow"
          text="Dark-Yellow"
          onClick={toggleDarkYellow}
        ></Button>
        {/* Light Yellow Theme */}
        <Button
          className="button-light-yellow"
          text="Light-Yellow"
          onClick={toggleLightYellow}
        ></Button>
        {/* Dark Green Theme */}
        <Button
          className="button-dark-green"
          text="Dark-Green"
          onClick={toggleDarkGreen}
        ></Button>
        {/* Dark Blue Theme */}
        <Button
          className="button-dark-blue"
          text="Dark-Blue"
          onClick={toggleDarkBlue}
        ></Button>
      </div>
    );
  }
};

export default connect(
  (state: RootState) => ({
    changeTheme: themeSelector(state)
  }),
  {
    changeThemeAction: changeThemeActionCreator
  }
)(Settings);
