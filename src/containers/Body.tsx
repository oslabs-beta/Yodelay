import React, {FunctionComponent, useRef } from 'react'
import { connect } from 'react-redux'
import TestProto from '../components/TestProto'
import Settings from '../components/Settings'
import { Route } from 'react-router'

// sets type for props
interface BodyProps {

  }



  export const Body: FunctionComponent<BodyProps> = props => {
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

    //   const {
    //     incrementAction
    //   } = props
      return (
        <div style = {{border: "solid 1px green", flexGrow: 2}}>
                  <input
          ref={serverInputRef}
          id="serverInput"
          placeholder="enter server ip address"
          onChange={handleChange}
        ></input>
        Body
          <Route exact path = "/"> 
            <TestProto>
              Test Proto
            </TestProto>
          </Route>
          <Route path = "/settings"> 
            <Settings>
              Settings
            </Settings>
          </Route>
        </div>
      )
    }
  }
};

export default Body;

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
