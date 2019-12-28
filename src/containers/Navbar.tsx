import React, {FunctionComponent, RefObject, useRef, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { Button } from '../components/common/Button';
import {uploadProtoActionCreator} from '../actions'
import { protoSelector } from '../reducers/uploadProto';
import { RootState } from '../reducers';

// sets type for props
  interface NavbarProps {
    inputOpenFileRef?: RefObject<HTMLInputElement>
    showOpenFileDlg?: () => any
    uploadProto?: typeof uploadProtoActionCreator
    protoFile?: File
  }

  export const Navbar: FunctionComponent<NavbarProps> = props => {
    {
      const { 
        uploadProto
      } = props
      
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
      const testClick = () =>{
        alert("clicked")
      }

      return (
        <div>
        Navbar
          <Link to ="/">
            <Button text='Home' onClick={ () => {testClick()}} >
            </Button>
          </Link>

          {/* Upload Proto Button */}
          <input ref={inputOpenFileRef} type="file" style={{display:"none"}} onChange={onFileSubmit}/>
          <Button id='uploadProto' text='enter' onClick={showOpenFileDlg} ></Button>
          
          <Link to = "/settings">
            <Button text='Settings' onClick={ () => {testClick()}} >
            </Button>
          </Link>
        </div>
      )
    }
  }

  export default connect (
  // gives the navbar component access to state and actions from the store  
    //using selector
    (state: RootState) => ({
        test2: protoSelector(state)
      }),
    {
      uploadProto: uploadProtoActionCreator,
    }

  )(Navbar)