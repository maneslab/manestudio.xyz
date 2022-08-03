import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { CheckCircleIcon } from '@heroicons/react/solid';

export default function ClubHeader({
    club,
    title,
    intro,
    active_id
}) {
    const { t } = useTranslation('common');

    let club_id = null;
    let step_1_finished_icon = null;
    let step_2_finished_icon = null;
    let step_3_finished_icon = null;

    let step_1_finished = false;
    let step_2_finished = false;
    let step_3_finished = false;

    if (club) {
        club_id = club.get('id');
        if (club.getIn(['is_step_done','step_1'])) {
            step_1_finished = true;
            step_1_finished_icon = <CheckCircleIcon className='icon-sm text-green-500 mr-2'/>
        }
        if (club.getIn(['is_step_done','is_deploy_testnet'])) {
            step_2_finished = false;
            step_2_finished_icon = <CheckCircleIcon className='icon-sm text-yellow-500 mr-2'/>
        }
        if (club.getIn(['is_step_done','step_2'])) {
            step_2_finished = true;
            step_2_finished_icon = <CheckCircleIcon className='icon-sm text-green-500 mr-2'/>
        }
        console.log('club',club.toJS())
        if (club.getIn(['is_public']) == 1) {
            step_3_finished = true;
            step_3_finished_icon = <CheckCircleIcon className='icon-sm text-green-500 mr-2'/>
        }
    }
    

    let base_url = '/project/'+club_id;

    return <div className='bg-white -mt-8 py-8 mb-8 border-t border-gray-200 dark:border-[#31343a] dark:bg-[#22252b] dark:text-white'>
        <div className='flex justify-between mx-auto max-w-screen-xl items-center'>
            <div>

                <h1 className='h1'>{title}</h1>
                <div className='text-sm text-gray-500 max-w-prose mt-3'>
                    {(intro) ? intro : t('no description')}
                </div>
            </div>
            <div>
                <div className='space-x-4 flex justify-end'>
                    {
                        (club)
                        ?   <div class="tabs club-nav-tabs">
                            <Link href={base_url+'/group'} className={"tab-active"}>
                                <a className={classNames("tab  capitalize",{"tab-active":(active_id == 1)})}>
                                    {step_1_finished_icon}
                                    1. {t('artworks')}
                                </a>
                            </Link>
                            {
                                (step_1_finished)
                                ? <Link href={base_url+'/contract'} activeClassName={"tab-active"}>
                                    <a className={classNames("tab  capitalize",{"tab-active":(active_id == 2)})}>
                                        {step_2_finished_icon}
                                        2. {t('smart contract')}
                                    </a>
                                </Link>
                                : <a className={classNames("tab  capitalize",{"tab-active":(active_id == 2)})}>
                                    {step_2_finished_icon}
                                    2. {t('smart contract')}
                                </a>
                            }
                            {
                                (step_2_finished)
                                ? <Link href={base_url+'/drop'} activeClassName={"tab-active"}>
                                    <a className={classNames("tab  capitalize",{"tab-active":(active_id == 3)})}>
                                        {step_3_finished_icon}
                                        3. {t('minting page')}
                                    </a>
                                </Link>
                                : <a className={classNames("tab  capitalize",{"tab-active":(active_id == 3)})}>
                                    3. {t('minting page')}
                                </a>
                            }
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    </div>

}
