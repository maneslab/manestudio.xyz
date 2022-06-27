import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';

import Input from 'components/form/field'
import PrefixInput from 'components/form/prefix_input';
import ExpiretimeSelect from 'components/form/expiretime_select';

import {  TrashIcon } from '@heroicons/react/outline';

export default function RefundableOne({refund,id,index,remove,errors}) {

    const {t} = useTranslation('common');
    //<Input label={t('time')} name={`refund[${index}].end_time`} className="w-1/2 mr-4"/>
    return (
        <div className={classNames('mb-2 bg-[#fff] text-black border-b border-gray-100 p-6 pt-4')}>
            <div className='border-gray-300'>
                <div className='flex justify-between'>
                    <ExpiretimeSelect label={t('time')} name={`refund[${index}].end_time`}  />
                    <PrefixInput endfix={"%"} label={t('refund rate')} name={`refund.${index}.refund_rate`} />
                    <div>
                        <label class="h-12 w-10 block"></label>
                        <button type="button" className='mr-4 opacity-50'  onClick={() => remove(index)}>
                            <TrashIcon className='icon-sm'/>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
