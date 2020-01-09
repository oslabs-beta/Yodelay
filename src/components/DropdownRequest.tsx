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
    let servicesObj: { [index: string] : {message:  { [nestedIndex: string] : { message: string }} } } = {};

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
              setMessageAction('');
            } else {
              setRequest(e.target.value);
              const messageFieldsObj: object  = Object.values(servicesObj[e.target.value])[0];
              const messageFieldsArrayOfTuples: string[][] = Object.entries(messageFieldsObj);
              let editorDisplay: string = '';
              for (let [field, type] of messageFieldsArrayOfTuples) {
                let typeDisplay: any = type;
                switch (type) {
                  case 'TYPE_STRING': {
                    typeDisplay = '"Hello"'
                    break;
                  }
                  case 'TYPE_INT32': {
                    typeDisplay = 10
                    break;
                  }
                }
                const currentStr: string =
                `"${field}": ${typeDisplay},\n  `
                editorDisplay += currentStr
              }
              editorDisplay = '{\n  ' + editorDisplay.slice(0, editorDisplay.length - 4) + '\n}';
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
