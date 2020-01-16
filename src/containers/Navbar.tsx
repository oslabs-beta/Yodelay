import React, { FunctionComponent, RefObject, useRef, createRef } from "react";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import { Button } from "../components/common/Button";
import { uploadProtoActionCreator } from "../actions";
import { protoSelector } from "../reducers/uploadProto";
import { RootState } from "../reducers";
import { themeSelector } from "../reducers/changeTheme";

// sets type for props
interface NavbarProps {
  inputOpenFileRef?: RefObject<HTMLInputElement>;
  showOpenFileDlg?: () => any;
  uploadProto?: typeof uploadProtoActionCreator;
  protoFile?: File;
  changeTheme: string;
}

//Upon user clicking upload proto button in navbar, folder dialog window opens. User-selected file is read and its contents are passed as a payload

export const Navbar: FunctionComponent<NavbarProps> = props => {
  {
    const { uploadProto, changeTheme } = props;

    //Refs allow us to access DOM nodes or React elements created in the render method
    //Both createRef and useRef hook returns the same result. createRef  returns a new ref on every render while useRef will return the same ref obj each time
    //

    const inputOpenFileRef = useRef<HTMLInputElement>();

    const showOpenFileDlg = () => {
      inputOpenFileRef.current.click();
    };
    const onFileSubmit = () => {
      const protoFile = inputOpenFileRef.current.files[0];

      const reader = new FileReader();

      reader.onloadend = e => {
        uploadProto(e.target.result);
      };

      reader.readAsText(protoFile);
    };

    let toggleThemeUploadProto =
      changeTheme === "dark-yellow" ||
      changeTheme === "dark-green" ||
      changeTheme === "dark-blue"
        ? "upload-proto-button-grey"
        : "upload-proto-button-light";

    let toggleThemeSettings =
      changeTheme === "dark-yellow" ||
      changeTheme === "dark-green" ||
      changeTheme === "dark-blue"
        ? "settings-button-grey"
        : "settings-button-light";

    return (
      <div>
        <Link to="/">
          <Button className="home-button"></Button>
        </Link>

        {/* Upload Proto Button */}
        <input
          ref={inputOpenFileRef}
          type="file"
          style={{ display: "none" }}
          onChange={onFileSubmit}
        />

        <Button
          className={toggleThemeUploadProto}
          onClick={showOpenFileDlg}
        ></Button>

        <Link to="/settings">
          <Button className={toggleThemeSettings}></Button>
        </Link>
      </div>
    );
  }
};

export default connect(
  // gives the navbar component access to specific state and actions from the store
  (state: RootState) => ({
    protoContents: protoSelector(state),
    changeTheme: themeSelector(state)
  }),
  {
    uploadProto: uploadProtoActionCreator
  }
)(Navbar);
