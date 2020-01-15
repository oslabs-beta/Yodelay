import React, { FunctionComponent } from "react";
import { EditorRequest } from "./EditorRequest";
import { EditorResponse } from "./EditorResponse";
import { statement } from "@babel/template";
import { setMessageActionCreator } from "../actions";
import { useDispatch } from "react-redux";
import { typeResponse } from "../reducers/uploadProto";

interface editorProps {
  setMessageAction?: typeof setMessageActionCreator;
  data: string;
  response: typeResponse[];
  changeTheme: string;
}

export const Editor: FunctionComponent<editorProps> = props => {
  {
    const { setMessageAction, data, response, changeTheme } = props;

    return (
      <>
        <EditorRequest
          data={data}
          newRequest={value => {
            setMessageAction(value);
          }}
          changeTheme={changeTheme}
        />

        <EditorResponse response={response} changeTheme={changeTheme} />
      </>
    );
  }
};
