import React from 'react';
// import classNames from 'classnames';
import { useTranslation } from 'next-i18next';

// import Input from 'components/form/field'
// import PrefixInput from 'components/form/prefix_input';
import ExpiretimeSelect from 'components/form/expiretime_select';

import {  TrashIcon } from '@heroicons/react/outline';
import PercentInput from 'components/form/percent_input'

export default function RefundableOne({refund,id,index,remove,errors}) {

    const {t} = useTranslation('common');
    //<Input label={t('time')} name={`refund[${index}].end_time`} className="w-1/2 mr-4"/>
    return (
        <div className={'mb-2 bg-[#fff] text-black border-b border-gray-100 p-6 pt-4 refund-one'}>
            <div className='border-gray-300'>
                <div className='flex justify-between'>
                    <ExpiretimeSelect label={t('time')} name={`refund[${index}].end_time`}  />
                    <PercentInput label={t('refund rate')} name={`refund.${index}.refund_rate`} />
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
