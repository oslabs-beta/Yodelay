import React, {FunctionComponent} from 'react'
// import AceEditor, {Command} from 'react-ace'
import AceEditor from 'react-ace'


interface RequestProps {
  data?: string
}

export function Request({data}: RequestProps) {
  return (
    <>
      <AceEditor>
        mode='json'
        name='requestInput'
        value={data}
        theme='monokai'
        style={{ background: "#272822" }}
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
      </AceEditor>
    </>
  )
}