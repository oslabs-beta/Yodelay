import React, { FunctionComponent } from 'react';
import { Button } from './common/Button';
import { showPopupActionCreator } from '../actions';

interface PopupProps {
  popup: boolean;
  toggle: typeof showPopupActionCreator;
  proto: string | ArrayBuffer;
}

export const Popup: FunctionComponent<PopupProps> = (props) => {
  {
    const {
      popup,
      toggle,
      proto
    } = props;

    const popupClass: string = popup ? 'popup-on' : 'popup-off';
    // const popupClass: string = "modal popup-off";

    const handleToggle = () => {
      toggle(!popup);
    }

    return(
      <div className={popupClass}>
        <div className="modal-main">
          <pre>{proto}</pre>
          <Button onClick={handleToggle} text={'Close'}></Button>
        </div>
      </div>
    )
  }
}