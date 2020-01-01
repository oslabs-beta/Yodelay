import React, {FunctionComponent} from 'react'
// import AceEditor, {Command} from 'react-ace'
import AceEditor from 'react-ace'
import { Tabs } from 'antd';
import {typeResponse} from '../reducers/uploadProto'


interface ResponseProps {
  response: typeResponse
}

export const EditorResponse: FunctionComponent <ResponseProps> = props => {
  {
    const defaultKey = `responseTab`;
    const {
      response
    } = props

    console.log(response)

    return (
      <>
        <Tabs
            defaultActiveKey={defaultKey}
            tabPosition={"top"}
            style={{width: "100%", height: "height: calc(100vh - 181px)"}}
          >
            <Tabs.TabPane tab={"Response"} key={"unaryResponse"}>
              <AceEditor
                mode='json'
                name='requestInput'
                value={response.message}
                theme='monokai'
                style={{ background: "white" }}
                fontSize={14}
                cursorStart={2}
                showPrintMargin={false}
                highlightActiveLine={true}
                tabSize={2}
                readOnly={true}
                setOptions={{
                  useWorker: true,
                  displayIndentGuides: true
                }}
              />
            </Tabs.TabPane>
          </Tabs>
      </>
    )
  }
}