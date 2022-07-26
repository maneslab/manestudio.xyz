

import {PhotographIcon} from '@heroicons/react/outline'

export default function Empty({text,icon,className}) {
  if (!icon) {
    icon = <PhotographIcon className="w-12 text-gray-400" />
  }
  return (
    <div className="text-center py-6" className={(className)?className:""} >
        <div className="mb-2 flex justify-center mb-4">{icon}</div>
        <div className="text-gray-700 dark:text-gray-300 text-base font-ubuntu">{(text)?text:'No Content'}</div>
    </div>
  )
}
