import React,{useState} from 'react'
import NavLink from 'components/common/navlink'
import { useTranslation } from 'react-i18next';

import { ArrowLeftIcon } from '@heroicons/react/solid';
import Link from 'next/link'

export default function ClubHeader({
    club_id
}) {
    const {t} = useTranslation("common");
    let base_url = '/project/'+club_id;

    return <div className='bg-white -mt-8 py-8 mb-8 border-t border-gray-300'>
        <div className='flex justify-between mx-auto max-w-screen-xl items-center'>
            <div>
                <Link href="/project/list"><a className='btn btn-outline'>
                    <ArrowLeftIcon className='icon-xs mr-2'/>
                    {t('back to projects')}
                </a></Link>
            </div>
            <div>
                <div className='space-x-4 club-header-menu'>
                    <NavLink href={base_url+'/upload'}><a>{t('upload')}</a></NavLink>
                    <NavLink href={base_url+'/generate'}><a>{t('generate')}</a></NavLink>
                    <NavLink href={base_url+'/contract'}><a>{t('contract')}</a></NavLink>
                    <NavLink href={base_url+'/metadata'}><a>{t('metadata')}</a></NavLink>
                    <NavLink href={base_url+'/drop'}><a>{t('drop')}</a></NavLink>
                </div>
            </div>
        </div>
    </div>

}
