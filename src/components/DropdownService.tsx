import React, { FunctionComponent } from 'react';
import { setServiceActionCreator } from '../actions';
interface DropdownServiceProps {
  id?: string;
  menuOptions?: object;
  setService: typeof setServiceActionCreator;
  value: string;
}
export const DropdownService: FunctionComponent<
  DropdownServiceProps
> = props => {
  {
    const { id, menuOptions, setService, value } = props;

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
