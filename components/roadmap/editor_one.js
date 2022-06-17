import React from 'react';
import classNames from 'classnames';
import {useSortable} from '@dnd-kit/sortable';
import { useTranslation } from 'next-i18next';
import {CSS} from '@dnd-kit/utilities';

import Input from 'components/form/field'
import Textarea from 'components/form/textarea'

import { MinusIcon, ChevronDownIcon,ChevronUpIcon, TrashIcon } from '@heroicons/react/outline';
import DragIcon from 'public/img/icons/drag.svg'

export default function SortableItem({roadmap,open_index,id,toggleOpen,remove,draging_index,errors}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: String(id)});

      
    let is_show = (open_index == id);
    let is_draging = (draging_index == id);
    let is_empty = (!roadmap['milestone'] && !roadmap['time_point']);



    const {t} = useTranslation('common');

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (is_draging) {
        style['zIndex'] = 10000
    }
  
    return (
        <div className={classNames('mb-2 form-block-base p-4 bg-[#fff] text-black z-10',{'open':is_show},{"shadow-xl relative":is_draging})} style={style} ref={setNodeRef} >
            <div className='flex justify-between cursor-pointer' onClick={()=>{
                toggleOpen(id)
            }}>
                <div className='flex justify-start flex-grow items-center'>
                <DragIcon className={classNames("mr-2 icon-sm text-black",{"bg-gray-100":is_draging})}  {...listeners} />
                {
                    (is_empty)
                    ? <div>{t('not set')}</div>
                    : <div>
                        <div className='flex justify-start text-base'>
                        <span className='text-gray-700'>{roadmap['time_point']}</span>
                        <MinusIcon className='w-6 mx-2'/>
                        <span>{roadmap['title']}</span>
                        </div>
                        <div className='text-sm opacity-50'>
                        {roadmap['detail']}
                        </div>
                    </div>
                }
                </div>
                <div className='flex items-center'>
                    <button type="button" className='mr-4 opacity-50'  onClick={() => remove(id)}>
                        <TrashIcon className='icon-sm'/>
                    </button>
                    {(is_show)?<ChevronUpIcon className='icon-sm'/>:<ChevronDownIcon className='icon-sm'/>}
                </div>
            </div>
            {
                (is_show)
                ? <div className='mt-4 pt-2 border-t border-gray-300'>
                    <div className='flex justify-between'>
                        <Input label={t('time point')} name={`roadmaps[${id}].time_point`} className="w-1/2 mr-4"/>
                        <Input label={t('title')} name={`roadmaps.${id}.title`}  className="w-1/2"/>
                    </div>
                    <Textarea label={t('detail')} name={`roadmaps.${id}.detail`}/>
                </div>
                : <>
                    {
                        (errors)
                        ? <div className='mt-4 pt-4 border-t border-gray-500 text-red-500'>{t('time_point and title cannot be empty')}</div>
                        : null
                    }
                </>
            }
            <div className='flex justify-end'>
                
            </div>

        </div>
    );
}
