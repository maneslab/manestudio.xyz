import React,{useState} from 'react';
import classNames from 'classnames';

import {confirm} from 'components/common/confirm/index'
import {DotsVerticalIcon,TrashIcon,PencilIcon} from '@heroicons/react/outline'

import DragIcon from 'public/img/icons/drag.svg'

import {useSortable} from '@dnd-kit/sortable';
import { useTranslation } from 'next-i18next';
import {CSS} from '@dnd-kit/utilities';

import TraitList from 'components/image/trait/list'


export default function LayerOne({handleDelete,handleEdit,layer,draging_index,refreshList,id}) {


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: String(id)});
      
    let is_draging = (draging_index == id);

    const {t} = useTranslation('common');

    let deleteLayer = async() => {
       
        if (await confirm({
            confirmation: t('are you sure you want to delete this layer?')
        })) {
            await handleDelete(layer.get('id'));
            refreshList();
        }
    }

    let [open,setOpen] = useState(false);


    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };


    return <div className={classNames('border-2 border-black mb-4 z-10',{"shadow-xl relative":is_draging})} style={style} ref={setNodeRef}>
        <div className="p-4 bg-white flex justify-between items-center relative">
            <DragIcon className={classNames("absolute -left-8 top-50% icon-sm",{"bg-gray-100":is_draging})}  {...listeners} />

            <div onClick={setOpen.bind({},!open)} className="flex-grow cursor-pointer">
                <h2 className='font-bold text-black capitalize'>{layer.get('name')}</h2>
                <div className='text-blue-400 text-sm'>
                    20 traits
                </div>
            </div>
            
            <div>
                <div class="dropdown dropdown-right">
                    <label tabindex="0" class="btn m-1 px-2 bg-white border-none text-gray-800 hover:bg-gray-200">
                        <DotsVerticalIcon className='icon-sm'/>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52 capitalize">
                        <li><a onClick={deleteLayer}><TrashIcon className='icon-sm'/>delete</a></li>
                        <li><a onClick={handleEdit.bind({},layer)}><PencilIcon className='icon-sm'/>edit</a></li>
                    </ul>
                </div>
            </div>
        </div>

        {
            (open)
            ? <div className='p-4 bg-[#e6ebf4]'>
                <TraitList layer_id={layer.get('id')} />
            </div>
            : null
        }
    </div>
}

