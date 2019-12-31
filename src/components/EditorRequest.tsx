import React, {FunctionComponent} from 'react'
// import AceEditor, {Command} from 'react-ace'
import AceEditor from 'react-ace'
import { Tabs } from 'antd';



interface RequestProps {
  data?: string
  newRequest: (value: string) => void
}

export const EditorRequest: FunctionComponent<RequestProps> = props => {
  {
    const { 
      data, 
      newRequest,
    } = props
    console.log(data)
    const editorTabKey = `editor Tab`; 
  
    
    return (
      <>
        <Tabs
        defaultActiveKey={editorTabKey}
        tabPosition={"top"}
        style={{width: "100%"}}
        >
          <Tabs.TabPane tab="Editor" key={editorTabKey}>
            <AceEditor
              mode='json'
              name='requestInput'
              value={data}
              onChange={newRequest}
              theme='monokai'
              style={{ background: "white" }}
              width={"100%"}
              fontSize={14}
              cursorStart={2}
              showPrintMargin={false}
              highlightActiveLine={true}
              tabSize={2}
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