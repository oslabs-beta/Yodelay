import React, {FunctionComponent, RefObject, useRef, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Button } from '../components/common/Button';


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

  }

  export const Navbar: FunctionComponent<NavbarProps> = props => {
    {
      const inputOpenFileRef = useRef <HTMLInputElement> ();
      const showOpenFileDlg = () => {
        inputOpenFileRef.current.click()
        console.log(inputOpenFileRef.current.files[0])  
        
        // const reader = new FileReader()
        // console.log(reader.readAsText(inputOpenFileRef.current))
      }
      //   inputOpenFileRef
      // } = props

      return (
        <div>
        Navbar
          <input ref={inputOpenFileRef} type="file" style={{display:"none"}}/>
          <Button id='uploadProto' text='enter' onClick={showOpenFileDlg} ></Button>
        </div>
      )
    }
  }

  export default Navbar

  // gives the app component access to state and actions from the store
//   export default connect(
  
//     //using selector
//     (state: RootState) => ({
//         test: countSelector(state)
//       })
//       ,
    
//     {
//       incrementAction: incrementActionCreator,
//     }
//   )(App)