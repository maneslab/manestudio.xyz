import React from 'react';
import classNames from 'classnames';
import {useSortable} from '@dnd-kit/sortable';
import useTranslation from 'next-translate/useTranslation'
import {CSS} from '@dnd-kit/utilities';

import Input from 'components/form/field'
import Textarea from 'components/form/textarea'

import { PlusIcon, ChevronDownIcon,ChevronUpIcon, TrashIcon } from '@heroicons/react/outline';
import DragIcon from 'public/img/icons/drag.svg'
import Upload from 'components/common/upload'
import TwitterSelect from 'components/form/mane/twitter_select'
import {uploadRequest} from 'helper/http'

export default function SortableItem({creator,club,open_index,id,toggleOpen,remove,draging_index,errors,updateCreatorImage}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: String(id)});
      
    console.log('creator',creator)

    let is_show = (open_index == id);
    let is_draging = (draging_index == id);
    let is_empty = (!creator['name'] && !creator['title']);

    const {t} = useTranslation('common');

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (is_draging) {
        style['zIndex'] = 10000
    }
  
    const uploadProps = uploadRequest({
        showUploadList : false,
        multiple: false,
        action: '/v1/upload/img?template=avatar',
        name : 'file',
        listType : 'picture',
        accept : '.jpg,.jpeg,.png,.gif',
    })



    return (
        <div className={classNames('mb-2 form-block-base p-4 d-bg-c-1 z-10',{'open':is_show},{"shadow-xl relative":is_draging})} style={style} ref={setNodeRef} >
            <div className='flex justify-between cursor-pointer' onClick={()=>{
                toggleOpen(id)
            }}>
                <div className='flex justify-start flex-grow items-center text-black dark:text-white'>
                <DragIcon className={classNames("mr-2 icon-sm ",{"d-bg-c-3":is_draging})}  {...listeners} />
                {
                    (is_empty)
                    ? <div>{t('not set')}</div>
                    : <div>
                        <div className='flex justify-start text-base'>
                        <span >{creator['name']}</span>
                        <span className='text-gray-500 dark:text-[#999] ml-4'>{creator['title']}</span>
                        </div>
                        <div className='text-sm opacity-50'>
                        {creator['detail']}
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
                ? <div className='mt-4 pt-2 border-t d-border-c-1 flex justify-between space-x-8'>
                    <div className='w-2/5'>
                        <div className='mb-2'>
                            <label className='label'>
                                <span className='label-text'>{t('avatar')}</span>
                            </label>
                            <div className='border-2 border-black dark:border-[#7a7c80]'>
                                {
                                    (!(creator['img_id'] > 0)) 
                                    ? <div className='aspect-square bg-gray-200'>

                                    </div>
                                    : <img src={creator['img']['image_urls']['url']} className="w-full"/>
                                }
                                <div>
                                <Upload uploadProps={uploadProps} afterSuccess={
                                    updateCreatorImage.bind({},id)
                                }>  
                                    <button type="button" className='btn w-full'>
                                        <PlusIcon className='w-4 mr-2' /> {t('upload image')}
                                    </button>
                                </Upload>
                            </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <Input label={t('name')} name={`creators[${id}].name`} />
                            <Input label={t('title')} name={`creators[${id}].title`} />
                        </div>
                    </div>
                    <div className='w-3/5'>
                        <Textarea label={t('bio')} name={`creators.${id}.bio`} minRows={5}/>
                        <Input label={t('link')} name={`creators[${id}].link`} />
                        <div className='grid grid-cols-2 gap-4'>
                            <TwitterSelect label={'twitter'} name={`creators[${id}].twitter_id`} club_id={club.get('id')}/>
                            <Input label={'instagram'} name={`creators[${id}].instagram_id`} />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <Input label={'discord'} name={`creators[${id}].discord`} />
                            <Input label={'email'} name={`creators[${id}].email`} />
                        </div>
                    </div>
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
