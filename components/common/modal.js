import React from 'react';

import Dialog from 'rc-dialog';
// import {XIcon} from '@heroicons/react/outline'
import CloseIcon from 'public/img/icons/close.svg'

export default function Modal({title,loading,className,closeIcon,...props}) {

  let closeIconComponent;
  if (closeIcon === false) {
      closeIconComponent = null
  }else {
      closeIconComponent = <CloseIcon className="w-4 h-4" />
  }        

  return (
    <Dialog title={title} closeIcon={closeIconComponent} className={className} visible {...props}>
      {props.children}
    </Dialog>
  )
}
