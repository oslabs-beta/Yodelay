import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  setMessageActionCreator,
  setServiceActionCreator,
  setUrlActionCreator
} from '../actions';
import { Editor } from './Editor';
import { DropdownMenu } from './common/DropdownMenu';
import { DropdownService } from './DropdownService';

// sets type for props
interface TestProtoProps {
  setMessageAction: typeof setMessageActionCreator;
  data: string;
  setServiceAction: typeof setServiceActionCreator;
  service: string;
  setUrlAction: typeof setUrlActionCreator;
  url: string;
  serviceOptions: object;
}

export const TestProto: FunctionComponent<TestProtoProps> = props => {
  {
    //menuOptions object holds the following content:
    //services: {
    //service1: {request1: {message1Options}}
    //service2: {request2: {message2Options}}
    //}
    const {
      serviceOptions,
      setMessageAction,
      data,
      setServiceAction,
      service,
      setUrlAction,
      url
    } = props;

    const handleUrlChange = (e: any) => {
      setUrlAction(e.target.value);
      console.log(url);
    };
    
    // const testServices = ["service1","service2","service3","service4" ]
    const testRequests = ['request1', 'request2', 'request3', 'request4'];

    return (
      <div style={{ border: 'solid 1px green', flexGrow: 2 }}>
        TestProto
        <div id="menu-options">
          <input
            id="urlInput"
            placeholder="enter server ip address"
            onChange={handleUrlChange}
          ></input>

          {/* needs to update based on service selected by user -> 'selectValue' in dropdown menu component should be used here --> serviceOptions[selectValue]*/}
          <DropdownService
            id="service-dropdown-menu"
            menuOptions={serviceOptions}
            setService={setServiceAction}
            value={service}
          ></DropdownService>

          {/* this should take in 'select value' */}
          <DropdownMenu
            id="request-dropdown-menu"
            menuOptions={testRequests}
          ></DropdownMenu>
        </div>
        <div>
          <Editor setMessageAction={setMessageAction} data={data} />
        </div>
      </div>
    );
  }
};

export default TestProto;

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
