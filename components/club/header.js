import React,{useState} from 'react'
import NavLink from 'components/common/navlink'
import useTranslation from 'next-translate/useTranslation'

// import { ArrowLeftIcon } from '@heroicons/react/solid';
// import Link from 'next/link'

export default function ClubHeader({
    club_id,
    title
}) {
    const { t, lang } = useTranslation('common')
    let base_url = '/project/'+club_id;


    return <div className='bg-white -mt-8 py-8 mb-8 border-t border-gray-200'>
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
                        <NavLink href={base_url+'/group'} matchstart={true} activeClassName={"tab-active"}><a class="tab  capitalize">{t('generate NFT')}</a></NavLink>
                        <NavLink href={base_url+'/contract'} activeClassName={"tab-active"}><a class="tab capitalize">{t('smart contract')}</a></NavLink>
                        <NavLink href={base_url+'/drop'} activeClassName={"tab-active"}><a class="tab capitalize">{t('mint page')}</a></NavLink>
                    </div>
                </div>
            </div>
        </div>
    </div>

}
