import React, { FunctionComponent } from "react";
// import AceEditor, {Command} from 'react-ace'
import AceEditor from "react-ace";
import { Tabs } from "antd";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-sqlserver";

interface RequestProps {
  data?: string;
  newRequest: (value: string) => void;
  changeTheme: string;
}

export const EditorRequest: FunctionComponent<RequestProps> = props => {
  {
    const { data, newRequest, changeTheme } = props;

    const editorTabKey = `editor Tab`;

    //CHANGE THEME
    let toggleTheme =
      changeTheme === "dark-yellow" ||
      changeTheme === "dark-green" ||
      changeTheme === "dark-blue"
        ? "monokai"
        : "SQL Server";

    return (
      <>
       <div>Editor
            <AceEditor
              mode="json"
              name="requestInput"
              value={data}
              onChange={newRequest}
              theme={toggleTheme}
              height={"250px"}
              width={"100%"}
              wrapEnabled
              showGutter
              fontSize={12}
              cursorStart={2}
              showPrintMargin={false}
              highlightActiveLine={false}
              tabSize={2}
              setOptions={{
                useWorker: true,
                displayIndentGuides: true
              }}
            />
         </div>
      </>
    );
  }
};
