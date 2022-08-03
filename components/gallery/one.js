import React from 'react';
import classNames from 'classnames';
import {useSortable} from '@dnd-kit/sortable';
import useTranslation from 'next-translate/useTranslation'
import {CSS} from '@dnd-kit/utilities';

import {confirm} from 'components/common/confirm/index'

import { TrashIcon } from '@heroicons/react/outline';
import DragIcon from 'public/img/icons/drag.svg'

export default function SortableItem({img,open_index,id,toggleOpen,remove,draging_index,autoSave}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: String(id)});
    
    // console.log('img',img,id,remove)

    let is_show = (open_index == id);
    let is_draging = (draging_index == id);

    const {t} = useTranslation('common');

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (is_draging) {
        style['zIndex'] = 10000
    }

    const  deleteItem = async (e) => {
        if (await confirm({
            confirmation: t('are you sure you want to delete this image?')
        })) {
            e.stopPropagation();
            remove(id)
            autoSave();
        }
    }
    /* onClick={()=>{
                toggleOpen(id)
            }}*/
  
    return (
        <div className={classNames('gallery-image-one',{'open':is_show},{"shadow-xl relative":is_draging})} style={style} ref={setNodeRef} >
            <div className='flex justify-between cursor-pointer'>
                <div className='flex justify-start flex-grow items-center' >
                    <div>
                        <img src={img.image_urls.url} />
                    </div>
                    <div className='hover-bg'></div>
                    <div className='tools'>
                        <button type="button" className='btn btn-primary'  onClick={deleteItem}>
                            <TrashIcon className='icon-sm'/>
                        </button>
                    </div>
                    <div>
                        <button className='btn absolute right-2 top-2 bg-transparent border-none px-2'    {...listeners}>
                            <DragIcon className="w-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
