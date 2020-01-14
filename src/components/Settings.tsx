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

    //should evaluate to button-dark-yellow
    let toggleThemeName = `button-${changeTheme}`;

    return (
      <div>
        ⚡⚙ COMING SOON ⚙⚡
        {/* Dark Yellow Theme */}
        <Button
          className={toggleThemeName}
          text={toggleThemeName}
          onClick={toggleDarkYellow}
        ></Button>
        {/* Light Yellow Theme */}
        <Button
          className={toggleThemeName}
          text={toggleThemeName}
          onClick={toggleLightYellow}
        ></Button>
        {/* Dark Green Theme */}
        <Button
          className={toggleThemeName}
          text={toggleThemeName}
          onClick={toggleDarkGreen}
        ></Button>
        {/* Dark Blue Theme */}
        <Button
          className={toggleThemeName}
          text={toggleThemeName}
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
