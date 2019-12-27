import React, { FunctionComponent, useRef } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { TextInput } from '../components/common/TextInput';

// sets type for props
interface BodyProps {}
export const Body: FunctionComponent<BodyProps> = props => {
  {
    //   const {
    //     incrementAction
    //   } = props
    const serverInputRef = useRef<HTMLInputElement>();

    const handleChange = (e: any) => {
      serverInputRef.current.value = e.target.value;
      console.log(
        'serverInputRef.current.value:',
        serverInputRef.current.value
      );
    };

    return (
      <div style={{ border: 'solid 1px green', flexGrow: 2 }}>
        <input
          ref={serverInputRef}
          id="serverInput"
          placeholder="enter server ip address"
          onChange={handleChange}
        ></input>
      </div>
    );
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
