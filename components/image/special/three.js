import React from 'react';

import {CheckIcon} from '@heroicons/react/outline'

export default function SpecialNftThree({special,handleSelect,is_selected}) {

    return <div className="bg-white text-sm text-gray-600" onClick={handleSelect.bind({},special.get('id'))}>
        <div className='relative aspect-square cursor-pointer'>
            <img src={special.getIn(['img','image_urls','url'])} className=""/>
        </div>
        <div className="p-2 flex justify-between">
            {
                (special.get('name')) ? special.get('name') : '(no name)'
            }
            {
                (is_selected)
                ?  <div className='bg-primary text-white w-5 h-5 flex justify-center items-center'>
                    <CheckIcon className="icon-xs" />
                </div>
                : null
            }
        </div>
    </div>
}

