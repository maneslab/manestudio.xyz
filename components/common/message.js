import React from 'react';

import Notification from 'rc-notification';

import {CheckCircleIcon,XCircleIcon} from '@heroicons/react/outline'
import LoadingIcon from '/public/img/common/loading.svg'

let notification = null;


if (typeof document !== 'undefined') {
  Notification.newInstance(
    {
        maxCount: 5,
        className: "block-message",
        style : {'top':0,'left':0},
    },
    n => {
      notification = n;
    },
  );
}




function success(msg,duration = 3) {
    notification.notice({
      duration: duration,
      content: <div className="alert alert-success shadow-lg">
        <div>
          <CheckCircleIcon className="icon-sm" /> 
          <span>{msg}</span>
        </div>
      </div>,
      onClose() {
        // console.log('simple close');
      },
    });
}

function error(msg,duration = 5) {
    console.log('准备报错',msg);
    notification.notice({
      duration: duration,
      content: <div className="alert alert-error shadow-lg">
        <div>
          <XCircleIcon className="icon-sm" /> 
          <span>{msg}</span>
        </div>
      </div>,
      onClose() {
        // console.log('simple close');
      },
    });
}

function loading(msg) {
    const key = Date.now();
    notification.notice({
      duration: null,
      key : key,
      content: <div className="alert alert-warning shadow-lg">
          <div>
          <LoadingIcon className="animate-spin icon-sm" /> 
          <span>{msg}</span>
          </div>
      </div>,
      onClose() {
        // console.log('loading close');
      },
    });
    return () => {
      notification.removeNotice(key)
    }
}





module.exports = {
    success  : success,
    error    : error,
    loading  : loading
}
