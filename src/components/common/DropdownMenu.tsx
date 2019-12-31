import React, { FunctionComponent } from 'react';
interface DropdownMenuProps {
  id?: string;
  menuOptions?: object;
}
export const DropdownMenu: FunctionComponent<DropdownMenuProps> = props => {
  {
    const { id, menuOptions } = props;
    
    //menuOptions object holds the following content: 
      //services: {
        //service1: {request1: {message1Options}}
        //service2: {request2: {message2Options}}
      //}
    //get array of services
    const servicesArr = Object.keys(menuOptions)
    console.log(servicesArr)
    let selectValue;
    return (
      <div>
        <select
          onChange={e => {
            selectValue = e.target.value;
          }}
          id="selectDd"
        >
          {servicesArr.map((menuOptions, i) => (
            <option key={i}>{menuOptions}</option>
          ))}
        </select>
      </div>
    );
  }
};


