import React,{useState} from 'react'
// import NavLink from 'components/common/navlink'
import classNames from 'classnames'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

// import { ArrowLeftIcon } from '@heroicons/react/solid';
// import Link from 'next/link'

export default function ClubHeader({
    club_id,
    title,
    active_id
}) {
    const { t, lang } = useTranslation('common')
    let base_url = '/project/'+club_id;


    return <div className='bg-white -mt-8 py-8 mb-8 border-t border-gray-200 dark:border-[#31343a] dark:bg-[#22252b] dark:text-white'>
        <div className='flex justify-between mx-auto max-w-screen-xl items-center'>
            <div>

                <h1 className='h1'>{title}</h1>
                <div className='text-sm text-gray-500 max-w-prose mt-3'>
                {t('generate-nft-header-intro')}
                </div>
            </div>
            <div>
                <div className='space-x-4 flex justify-end'>
                    <div class="tabs club-nav-tabs">
                        <Link href={base_url+'/group'} className={"tab-active"}><a className={classNames("tab  capitalize",{"tab-active":(active_id == 1)})}>{t('generate NFT')}</a></Link>
                        <Link href={base_url+'/contract'} activeClassName={"tab-active"}><a className={classNames("tab  capitalize",{"tab-active":(active_id == 2)})}>{t('smart contract')}</a></Link>
                        <Link href={base_url+'/drop'} activeClassName={"tab-active"}><a className={classNames("tab  capitalize",{"tab-active":(active_id == 3)})}>{t('mint page')}</a></Link>
                    </div>
                </div>
            </div>
        </div>
    </div>

}
