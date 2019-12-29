import React, {FunctionComponent} from 'react'
// import AceEditor, {Command} from 'react-ace'
import AceEditor from 'react-ace'


interface ResponseProps {
  data?: string
}

export function Response({data}: ResponseProps) {
  return (
    <>
      <AceEditor>
        mode='json'
        name='requestInput'
        value={data}
        theme='monokai'
        style={{ background: "#272822" }}
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