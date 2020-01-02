import React, { FunctionComponent } from 'react';
// import AceEditor, {Command} from 'react-ace'
import AceEditor from 'react-ace';
import { Tabs } from 'antd';
import { typeResponse } from '../reducers/uploadProto';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-merbivore'
import 'ace-builds/src-noconflict/theme-pastel_on_dark'
import 'ace-builds/src-noconflict/mode-json'

interface ResponseProps {
  response: typeResponse;
}

export const EditorResponse: FunctionComponent<ResponseProps> = props => {
  {
    const defaultKey = `responseTab`;
    const { response } = props;

    return (
      <>
        <Tabs
          defaultActiveKey={defaultKey}
          tabPosition={'top'}
          style={{ width: '100%', height: 'height: calc(100vh - 181px)' }}
        >
          <Tabs.TabPane tab={'Response'} key={'unaryResponse'}>
            <AceEditor
              mode="json"
              name="requestInput"
              value={response.message}
              width = {"100%"}
              height={"250px"}
              theme="monokai"
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
                displayIndentGuides: false,
                highlightGutterLine: false,
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </>
    );
  }
};
