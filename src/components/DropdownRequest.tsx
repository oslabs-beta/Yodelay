import React, { FunctionComponent } from "react";
import { setRequestActionCreator, setMessageActionCreator } from "../actions";
import { typeRequest } from "../reducers/uploadProto";

interface DropdownRequestProps {
  parsedProtoObj: any;
  className: string;
  menuOptions: any;
  service: string;
  setRequest: typeof setRequestActionCreator;
  value: typeRequest;
  setMessageAction?: typeof setMessageActionCreator;
}
export const DropdownRequest: FunctionComponent<DropdownRequestProps> = props => {
  {
    const {
      parsedProtoObj,
      className,
      menuOptions,
      service,
      setRequest,
      value,
      setMessageAction
    } = props;

    //create array of requests
    let servicesArr: string[] = [];
    let servicesObj: {
      [index: string]: {
        message: { [nestedIndex: string]: { message: string } };
      };
    } = {};

    if (service) {
      servicesArr = Object.keys(menuOptions[service]);
      servicesObj = menuOptions[service];
    } else {

    }

    return (
      <div>
        <select
          onChange={e => {
            if (e.target.value === "Select Request") {
              setRequest({ methodName: "", streamType: "" });
              setMessageAction("");
            } else {
              //user selects request method
              let requestSelected = e.target.value;

              //Need to update state w/ requestSelected and streamType
              let streamType =
                parsedProtoObj["services"][`${service}`][`${requestSelected}`]
                  .type;
                  
              setRequest({
                methodName: requestSelected,
                streamType: streamType
              });

              //Need to auto populate editor with types
              const messageFieldsObj: object = Object.values(
                servicesObj[e.target.value]
              )[0];
              const messageFieldsArrayOfTuples: string[][] = Object.entries(
                messageFieldsObj
              );
              let editorDisplay: string = "";
              for (let [field, type] of messageFieldsArrayOfTuples) {
                // if (Array.isArray(type)) {
                //   let [definedMessageType, definedMessageName] = type;
                //   let definedMessageString =  

                // } else {

                // }
                let typeDisplay: any = type;
                switch (type) {
                  case "TYPE_STRING": {
                    typeDisplay = '"Hello"';
                    break;
                  }
                  case "TYPE_INT32": {
                    typeDisplay = 10;
                    break;
                  }
                  case "TYPE_INT32": {
                    typeDisplay = 10;
                    break;
                  }
                }
                const currentStr: string = `"${field}": ${typeDisplay},\n  `;
                editorDisplay += currentStr;
              }
              editorDisplay =
                "{\n  " +
                editorDisplay.slice(0, editorDisplay.length - 4) +
                "\n}";
              setMessageAction(editorDisplay);
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
