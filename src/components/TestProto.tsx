import React, {FunctionComponent, useRef } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import {setMessageActionCreator} from '../actions'
import {Editor} from './Editor'

import { DropdownMenu} from './common/DropdownMenu';


// sets type for props
interface TestProtoProps {
  serviceOptions: object
  setMessageAction: typeof setMessageActionCreator
  data: string
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

      //menuOptions object holds the following content: 
      //services: {
      //service1: {request1: {message1Options}}
      //service2: {request2: {message2Options}}
      //}
      const {
        serviceOptions,
        setMessageAction,
        data
      } = props

      // const testServices = ["service1","service2","service3","service4" ]
      const testRequests = ["request1","request2","request3","request4" ]



      return (
        <div style = {{border: "solid 1px green", flexGrow: 2}}>
        TestProto
          <div id = "menu-options"> 
            <input
              ref={serverInputRef}
              id="serverInput"
              placeholder="enter server ip address"
              onChange={handleChange}
            >
            </input>

            {/* needs to update based on service selected by user -> 'selectValue' in dropdown menu component should be used here --> serviceOptions[selectValue]*/}
            <DropdownMenu id = "service-dropdown-menu" menuOptions = {serviceOptions} ></DropdownMenu>

          
          {/* this should take in 'select value' */}
            <DropdownMenu id = "request-dropdown-menu" menuOptions = {testRequests} ></DropdownMenu>
          </div>

          <div>
          <Editor setMessageAction={setMessageAction} data={data} />

          </div>
        
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