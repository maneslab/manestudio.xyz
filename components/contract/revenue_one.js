import React from 'react';
// import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation'
import Input from 'components/form/field'

import {  TrashIcon } from '@heroicons/react/outline';
import PercentInput from 'components/form/percent_input'

export default function RevenueOne({share,id,index,remove,errors}) {

    const {t} = useTranslation('common');
    return (
        <div className={'mb-2 bg-white dark:bg-[#22252b] p-6 pt-4 refund-one'}>
            <div className='border-gray-300'>
                <div className='flex justify-between'>
                    <Input label={t('address')} name={`revenue_share[${index}].address`} style={{'width':'380px'}} />
                    <PercentInput label={t('refund rate')} name={`revenue_share.${index}.rate`} style={{'width':'180px'}} />
                    <div className='flex  justify-end items-end'>
                        <button type="button" className='btn btn-error btn-outline'  onClick={() => remove(index)}>
                            <TrashIcon className='icon-sm'/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
