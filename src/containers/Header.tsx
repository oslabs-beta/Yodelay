import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Button } from "../components/common/Button";
import { RootState } from "../reducers";
import { themeSelector } from "../reducers/changeTheme";
import { changeThemeActionCreator } from "../actions";

// sets type for props
interface HeaderProps {
  changeThemeAction: typeof changeThemeActionCreator;
  changeTheme: string;
}
export const Header: FunctionComponent<HeaderProps> = props => {
  {
    const { changeTheme } = props;

    // //should evaluate to button-dark-yellow
    let toggleThemeName = `header-button-${changeTheme}`;

    return (
      <div id="header-container">
        {/* On click, sends user back to home page */}
        <Link to="/">
          <Button className={toggleThemeName} text="Yodelay.io"></Button>
        </Link>
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
)(Header);
