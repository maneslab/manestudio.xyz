import React,{useState,useRef} from 'react';
import classNames from 'classnames';

import {confirm} from 'components/common/confirm/index'
import {DotsVerticalIcon,TrashIcon,PencilIcon,AdjustmentsIcon} from '@heroicons/react/outline'

import DragIcon from 'public/img/icons/drag.svg'

import {useSortable} from '@dnd-kit/sortable';
import useTranslation from 'next-translate/useTranslation'
import {CSS} from '@dnd-kit/utilities';

import TraitList from 'components/image/trait/list'
import ProbabilityModal from 'components/image/trait/probability_modal'


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
    let [showProbalityModal,setShowProbalityModal] = useState(false);


    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const listRef = useRef(null);

    let openProbabilityModal = () => {
        console.log('listRef',listRef)
    }

    let toggleProbabilityModal = () => {
        setShowProbalityModal(!showProbalityModal);
    }


    return <div className={classNames('border-2 border-black mb-4 z-10 ',{"shadow-xl relative":is_draging},{"layer-open":open},{"layer-close":!open})} style={style} ref={setNodeRef}>
        <div className="p-4 bg-white dark:bg-[#22252b] flex justify-between items-center relative">
            <DragIcon className={classNames("absolute -left-8 top-50% icon-sm",{"d-bg-c-1":is_draging})}  {...listeners} />

            <div onClick={setOpen.bind({},!open)} className="flex-grow cursor-pointer">
                <h2 className='font-bold text-black dark:text-white capitalize'>{layer.get('name')}</h2>
                <div className='text-blue-400 text-sm'>
                    {layer.get('trait_count')} traits
                </div>
            </div>
            
            <div className='flex justify-end items-center'>
                <button className='btn btn-ghost' onClick={toggleProbabilityModal}>
                    <AdjustmentsIcon className='icon-sm'/>
                </button>
                <div class="dropdown dropdown-right">
                    <label tabindex="0" class="btn m-1 px-2 bg-white border-none text-gray-800 hover:bg-gray-200 dark:bg-[#22252b] dark:hover:bg-[#191c20] dark:text-white">
                        <DotsVerticalIcon className='icon-sm'/>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white dark:bg-[#191c20] rounded-box w-52 capitalize">
                        <li><a onClick={deleteLayer}><TrashIcon className='icon-sm'/>{t('delete')}</a></li>
                        <li><a onClick={handleEdit.bind({},layer)}><PencilIcon className='icon-sm'/>{t('edit')}</a></li>
                    </ul>
                </div>
            </div>
        </div>

        {
            (open)
            ? <div className={classNames('bg-[#e6ebf4] dark:bg-[#22252b]',{'animate-fade-in':open},{'animate-fade-out':!open})}>
                <TraitList ref={listRef} layer_id={layer.get('id')} toggleProbabilityModal={toggleProbabilityModal}/>
            </div>
            : null
        }

        <ProbabilityModal 
                layer_id={layer.get('id')} 
                visible={showProbalityModal} 
                closeModal={toggleProbabilityModal} />
    </div>
}

