import React, { FunctionComponent } from 'react';
interface DropdownServiceProps {
  id?: string;
  menuOptions?: object;
  setService: any;
  value: string;
}
export const DropdownService: FunctionComponent<
  DropdownServiceProps
> = props => {
  {
    const { id, menuOptions, setService, value } = props;

    //menuOptions object holds the following content:
    //services: {
    //service1: {request1: {message1Options}}
    //service2: {request2: {message2Options}}
    //}
    //get array of services
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
          id="selectDd"
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
