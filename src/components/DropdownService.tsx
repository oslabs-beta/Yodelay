import React, { FunctionComponent } from 'react';
import { setServiceActionCreator, startWebsocketActionCreator } from '../actions';
interface DropdownServiceProps {
  className?: string;
  menuOptions?: object;
  setService: typeof setServiceActionCreator;
  value: string;
  startWebsocket: typeof startWebsocketActionCreator;
}
export const DropdownService: FunctionComponent< DropdownServiceProps> = props => {
  {
    const { className, menuOptions, setService, startWebsocket, value } = props;

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
              startWebsocket('string')
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
