import React,{useState} from 'react'
import NavLink from 'components/common/navlink'
import { useTranslation } from 'react-i18next';

import { ArrowLeftIcon } from '@heroicons/react/solid';
import Link from 'next/link'

export default function ClubHeader({
    club_id,
    title
}) {
    const {t} = useTranslation("common");
    let base_url = '/project/'+club_id;

    /*                <Link href="/project/list"><a className='flex justify-start items-center'>
                    <ArrowLeftIcon className='icon-xs mr-2 mb-1'/>
                    {t('back to projects')}
                </a></Link>*/

    return <div className='bg-white -mt-8 py-8 mb-8 border-t border-gray-200'>
        <div className='flex justify-between mx-auto max-w-screen-xl items-center'>
            <div>

                <h1 className='h1'>{title}</h1>
                <div className='text-sm text-gray-500 max-w-prose mt-3'>
                Create generative collections by adding layers as seperate traits and uploading elements as properties. Adjust the layer sequence and decided how often .
                </div>
            </div>
            <div>
                <div className='space-x-4 flex justify-end'>
                    <div class="tabs club-nav-tabs">
                        <NavLink href={base_url+'/group'} activeClassName={"tab-active"}><a class="tab  capitalize">{t('generate NFT')}</a></NavLink>
                        <NavLink href={base_url+'/contract'} activeClassName={"tab-active"}><a class="tab capitalize">{t('contract')}</a></NavLink>
                        <NavLink href={base_url+'/drop'} activeClassName={"tab-active"}><a class="tab capitalize">{t('mint page')}</a></NavLink>
                    </div>
                </div>
            </div>
        </div>
    </div>

}
