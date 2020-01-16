import React, { FunctionComponent } from "react";
// import AceEditor, {Command} from 'react-ace'
import AceEditor from "react-ace";
import { Tabs } from "antd";
import { typeResponse } from "../reducers/uploadProto";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-sqlserver";

interface ResponseProps {
  response: typeResponse[];
  changeTheme: string;
}

export const EditorResponse: FunctionComponent<ResponseProps> = props => {
  {
    const defaultKey = `responseTab`;
    const { response, changeTheme } = props;

    let stringResponse = "";
    let requestCount = 0;
    let responseCount = 0;
    response.forEach((element, i) => {
      if( i === 0) {
        responseCount = 0;
        requestCount = 0;
      }
      if (typeof element === 'object') {
        responseCount += 1;
        stringResponse += `\nResponse:\n${element.message}\n`;
      } else {
        requestCount += 1;
        stringResponse += `\nRequest:\n${element}\n`;
      }
    });

    let responseTime = 1;

    //CHANGE THEME
    let toggleTheme =
      changeTheme === "dark-yellow" ||
      changeTheme === "dark-green" ||
      changeTheme === "dark-blue"
        ? "monokai"
        : "SQL Server";

    return (
      <>
         <div> Log
            <AceEditor
              mode="json"
              name="requestInput"
              value={stringResponse}
              width={"100%"}
              height={"250px"}
              theme={toggleTheme}
              fontSize={12}
              cursorStart={2}
              showGutter
              wrapEnabled
              showPrintMargin={false}
              highlightActiveLine={false}
              tabSize={2}
              readOnly={true}
              setOptions={{
                useWorker: true,
                displayIndentGuides: true,
                highlightGutterLine: false
              }}
            />
          </div>
      </>
    );
  }
};
