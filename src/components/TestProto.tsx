import React, {FunctionComponent, useRef } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { DropdownMenu} from './common/DropdownMenu';


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

      //test buttons - remove later
      const testDropdownClick = () =>{
        alert("Clicked dropdown")
      }

      //test array of options
      const testServices = ["service1","service2","service3","service4" ]
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

            <DropdownMenu id = "service-dropdown-menu" onClick ={testDropdownClick} options = {testServices} ></DropdownMenu>

            <DropdownMenu id = "request-dropdown-menu" onClick ={testDropdownClick} options = {testRequests} ></DropdownMenu>
          </div>

          <div>

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