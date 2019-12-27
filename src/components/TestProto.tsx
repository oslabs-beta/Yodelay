import React, {FunctionComponent, useRef } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// sets type for props
interface TestProtoProps {

  }
  
  export const TestProto: FunctionComponent<TestProtoProps> = props => {
    {
      const serverInputRef = useRef<HTMLInputElement>();

      // handle serverInput change
      const handleChange = (e: any) => {
        serverInputRef.current.value = e.target.value;
        console.log(
          'serverInputRef.current.value:',
          serverInputRef.current.value
        );
      };
      return (
        <div style = {{border: "solid 1px green", flexGrow: 2}}>
        TestProto
        <input
          ref={serverInputRef}
          id="serverInput"
          placeholder="enter server ip address"
          onChange={handleChange}
        ></input>
        </div>
      )
    }
  }
  

export default TestProto

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