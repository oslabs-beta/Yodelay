import React, { FunctionComponent } from 'react';
import { setRequestActionCreator } from '../actions';
interface DropdownRequestProps {
  className: string;
  menuOptions: any;
  service: string;
  setRequest: typeof setRequestActionCreator;
  value: string;
}
export const DropdownRequest: FunctionComponent<
  DropdownRequestProps
> = props => {
  {
    const { className, menuOptions, service, setRequest, value } = props;

    //create array of requests
    let servicesArr: string[] = [];
    if (service) {
      servicesArr = Object.keys(menuOptions[service]);
    }

    return (
      <div>
        <select
          onChange={e => {
            if (e.target.value === 'Select Request') {
              setRequest('');
            } else {
              setRequest(e.target.value);
            }
          }}
        >
          <option>Select Request</option>
          {servicesArr.map((menuOptions, i) => (
            <option key={i}>{menuOptions}</option>
          ))}
        </select>
      </div>
    );
  }
};
