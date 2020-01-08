import React, { FunctionComponent } from 'react';
import { setRequestActionCreator, setMessageActionCreator } from '../actions';
interface DropdownRequestProps {
  className: string;
  menuOptions: any;
  service: string;
  setRequest: typeof setRequestActionCreator;
  value: string;
  setMessageAction?: typeof setMessageActionCreator;
}
export const DropdownRequest: FunctionComponent<
  DropdownRequestProps
> = props => {
  {
    const { className, menuOptions, service, setRequest, value, setMessageAction  } = props;

    //create array of requests
    let servicesArr: string[] = [];
    let servicesObj: object = {};

    if (service) {
      servicesArr = Object.keys(menuOptions[service]);
      servicesObj = menuOptions[service];
    }

    return (
      <div>
        <select
          onChange={e => {
            if (e.target.value === 'Select Request') {
              setRequest('');
            } else {
              setRequest(e.target.value);
              const messageType: any = Object.keys(servicesObj[e.target.value])[0];
              const messageFields: any = servicesObj[e.target.value][messageType]
              const messageFieldsArray: any = Object.entries(messageFields);
              let editorDisplay: any = ''
              for (let entry of messageFieldsArray) {
                let typeDisplay: any = entry[1];
                // switch (entry[1]) {
                //   case 'TYPE_STRING': {
                //     typeDisplay = 'hello'
                //   }
                // }
                const currentStr: any =
                `"${entry[0]}": ${typeDisplay},\n `
                editorDisplay += currentStr
              }
              editorDisplay = '{\n ' + editorDisplay.slice(0, editorDisplay.length - 3) + '\n}';
              setMessageAction(editorDisplay)
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
