import React, {FunctionComponent, RefObject, useRef, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from '../components/common/Button';
import {uploadProtoActionCreator} from '../actions'
import { protoSelector } from '../reducers/test2';
import { RootState } from '../reducers';

// sets type for props
  interface NavbarProps {
    inputOpenFileRef?: RefObject<HTMLInputElement>
    showOpenFileDlg?: () => any
    uploadProtoAction?: typeof uploadProtoActionCreator
    f?: File
  
  }

  export const Navbar: FunctionComponent<NavbarProps> = props => {
    {
      const { 
        uploadProtoAction
      } = props
      
      const inputOpenFileRef = useRef <HTMLInputElement> ();
      const showOpenFileDlg = () => {
        inputOpenFileRef.current.click()
      }
      const onFileSubmit = () => {
        //f is a file type
        const f = (inputOpenFileRef.current.files[0])

        const reader = new FileReader()

        reader.onloadend = (e) => {console.log('german',e.target.result) 
        uploadProtoAction(e.target.result)
        }
        const file = reader.readAsText(f)
     
      }

      return (
        <div>
        Navbar
          <input ref={inputOpenFileRef} type="file" style={{display:"none"}} onChange={onFileSubmit}/>
          <Button id='uploadProto' text='enter' onClick={showOpenFileDlg} ></Button>
        </div>
      )
    }
  }

  export default connect (
  // gives the app component access to state and actions from the store
//   export default connect(
  
    //using selector
    (state: RootState) => ({
        test2: protoSelector(state)
      }),
    {
      uploadProtoAction: uploadProtoActionCreator,
    }

  )(Navbar)