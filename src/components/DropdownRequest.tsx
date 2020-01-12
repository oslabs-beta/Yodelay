import React, { FunctionComponent } from "react";
import { setRequestActionCreator } from "../actions";
import { typeRequest } from "../reducers/uploadProto";

interface DropdownRequestProps {
  parsedProtoObj: any;
  className: string;
  menuOptions: any;
  service: string;
  setRequest: typeof setRequestActionCreator;
  value: typeRequest;
}
export const DropdownRequest: FunctionComponent<DropdownRequestProps> = props => {
  {
    const {
      parsedProtoObj,
      className,
      menuOptions,
      service,
      setRequest,
      value
    } = props;

    //create array of requests
    let servicesArr: string[] = [];
    if (service) {
      servicesArr = Object.keys(menuOptions[service]);
    }

    return (
      <div>
        <select
          onChange={e => {
            if (e.target.value === "Select Request") {
              setRequest({ methodName: "", streamType: "" });
            } else {
              let requestSelected = e.target.value;
              //update state w/ requestSelected and streamType
              let streamType =
                parsedProtoObj["services"][`${service}`][`${requestSelected}`]
                  .type;

              // console.log(
              //   "this is service obj:",
              //   parsedProtoObj["services"][`${service}`][`${requestSelected}`]
              // );
              setRequest({
                methodName: requestSelected,
                streamType: streamType
              });
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
