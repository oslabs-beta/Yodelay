import React, {FunctionComponent, RefObject, useRef, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from '../components/common/Button';
import {uploadProtoActionCreator} from '../actions'
import { protoSelector } from '../reducers/test2';
import { RootState } from '../reducers';





// export class MainMenu extends React.Component<MainMenuProps, {}> {
//   private readonly inputOpenFileRef : RefObject<HTMLInputElement>
//   constructor() {
//       super({})
//       this.inputOpenFileRef = React.createRef()
//   }
//   showOpenFileDlg = () => {
//       this.inputOpenFileRef.current.click()
//   }
//   render() {
//       return (
//          <div>
//                   <input ref={this.inputOpenFileRef} type="file" style={{display:"none"}}/>
//                   <button onClick={this.showOpenFileDlg}>Open</Button>
//         </div>
//       )
//   }
//   }

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
        const f = uploadProtoAction(inputOpenFileRef.current.files[0]).payload
        console.log('cedric', f)
        console.log("is it a blob", f instanceof Blob)
        console.log("is it a file",f instanceof File)
        console.log(typeof f)

        const reader = new FileReader()
        // const blob = f.slice(1, 1187)

        reader.onloadend = (e) => {console.log('german',e.target.result)}
        const file = reader.readAsText(f)
        console.log('hello', file)
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