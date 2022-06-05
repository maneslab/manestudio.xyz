import React from 'react';

import Notification from 'rc-notification';

import {CheckCircleIcon,XCircleIcon} from '@heroicons/react/solid'
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
      content: <div className="de-alert">
          <CheckCircleIcon className="w-6 h-6 mr-3 stroke-current text-green-500" /> 
          <label>{msg}</label>
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
      content: <div className="de-alert">
          <XCircleIcon className="w-6 h-6 mr-3 stroke-current text-red-500" /> 
          <label>{msg}</label>
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
      content: <div className="de-alert">
          <LoadingIcon className="animate-spin w-4 h-4 mr-3 stroke-current text-gray-500" /> 
          <label>{msg}</label>
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
