import React, { FunctionComponent } from 'react';
import { setServiceActionCreator, 
  startWebsocketActionCreator, 
  clearResponseEditorActionCreator, 
  setWsCommandActionCreator } 
  from '../actions';
interface DropdownServiceProps {
  className?: string;
  menuOptions?: object;
  value: string;
  setService: typeof setServiceActionCreator;
  startWebsocket: typeof startWebsocketActionCreator;
  clearResponseEditor: typeof clearResponseEditorActionCreator;
  setWsCommandAction: typeof setWsCommandActionCreator;
}
export const DropdownService: FunctionComponent< DropdownServiceProps> = props => {
  {
    const { 
      className, 
      menuOptions, 
      setService, 
      startWebsocket, 
      value,
      setWsCommandAction,
      clearResponseEditor
    } = props;

    //create array of services
    const servicesArr = Object.keys(menuOptions);

    return (
      <div>
        <select
          onChange={e => {
            if (e.target.value === 'Select Service') {
              setService('');
            } else {
              setService(e.target.value);
              startWebsocket('string');
              setWsCommandAction('');
              clearResponseEditor([])
            }
          }}
        >
          <option>Select Service</option>
          {servicesArr.map((menuOptions, i) => (
            <option key={i}>{menuOptions}</option>
          ))}
        </select>
      </div>
    );
  }
};
