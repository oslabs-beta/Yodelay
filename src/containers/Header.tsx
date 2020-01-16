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

    const navToGithub = () => {
      window.location.href = "https://github.com/oslabs-beta/Yodelay";
    };

    const navToTwitter = () => {
      window.location.href = "https://twitter.com/yodelay_io";
    };

    return (
      <div>
        {/* On click, sends user back to home page */}
        <div style={{ display: "block", height: "15px" }}></div>
        <div id="header-container">
          <Link to="/">
            <Button className={toggleThemeName} text="Yodelay.io"></Button>
          </Link>
          <div id="social-media">
            <Button className="github-button" onClick={navToGithub}></Button>
            <Button className="twitter-button" onClick={navToTwitter}></Button>
            <div style={{ display: "block", width: "15px" }}></div>
          </div>
        </div>
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
