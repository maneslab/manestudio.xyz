import React from 'react';

import Dialog from 'rc-dialog';
import {XIcon} from '@heroicons/react/outline'

export default function Modal({title,loading,className,closeIcon,...props}) {

  let closeIconComponent;
  if (closeIcon === false) {
      closeIconComponent = null
  }else {
      closeIconComponent = <XIcon className="w-5 h-5" />
  }        

  return (
    <Dialog title={title} closeIcon={closeIconComponent} className={className} visible {...props}>
      {props.children}
    </Dialog>
  )
}
