import React, {FunctionComponent, RefObject, useRef, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { Button } from '../components/common/Button';
import {uploadProtoActionCreator} from '../actions'
import { protoSelector, protoObjSelector } from '../reducers/uploadProto';
import { RootState } from '../reducers';

// sets type for props
  interface NavbarProps {
    inputOpenFileRef?: RefObject<HTMLInputElement>
    showOpenFileDlg?: () => any
    uploadProto?: typeof uploadProtoActionCreator
    protoFile?: File
  }

  //Upon user clicking upload proto button in navbar, folder dialog window opens. User-selected file is read and its contents are passed as a payload

  export const Navbar: FunctionComponent<NavbarProps> = props => {
    {
      const { 
        uploadProto
      } = props

      //Refs allow us to access DOM nodes or React elements created in the render method
      //Both createRef and useRef hook returns the same result. createRef  returns a new ref on every render while useRef will return the same ref obj each time
      //

      const inputOpenFileRef = useRef <HTMLInputElement> ();
      
      const showOpenFileDlg = () => {
        inputOpenFileRef.current.click()
      }
      const onFileSubmit = () => {
        const protoFile = (inputOpenFileRef.current.files[0])

        const reader = new FileReader()

        reader.onloadend = (e) => { 
        uploadProto(e.target.result)
        }

        const file = reader.readAsText(protoFile)
     
      }

      //test buttons - remove later
      const testHomeClick = () =>{
        alert("Clicked home")
      }

      const testSettingsClick = () =>{
        alert("Clicked settings")
      }


      return (
        <div>
        Navbar
          <Link to ="/">
            <Button text='Home' onClick={ () => {testHomeClick()}}>
            </Button>
          </Link>

          {/* Upload Proto Button */}
          <input ref={inputOpenFileRef} type="file" style={{display:"none"}} onChange={onFileSubmit}/>
          <Button id='uploadProto' text='enter' onClick={showOpenFileDlg} icon = "http://simpleicon.com/wp-content/uploads/cloud-upload-2.png"></Button>
          
          <Link to = "/settings">
            <Button text='Settings' onClick={ () => {testSettingsClick()}} >
            </Button>
          </Link>
        </div>
      )
    }
  }

  export default connect (
  // gives the navbar component access to specific state and actions from the store  
    (state: RootState) => ({
        protoContents: protoSelector(state),
        protoObjContents: protoObjSelector(state)

      }),
    {
      uploadProto: uploadProtoActionCreator,
    }

  )(Navbar)