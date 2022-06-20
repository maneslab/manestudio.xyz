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
                <div className='space-x-4 club-header-menu flex justify-end'>
                    <NavLink href={base_url+'/group'}><div className="capitalize cursor-pointer hover:text-gray-500">{t('generate NFT')}</div></NavLink>
                    <NavLink href={base_url+'/contract'}><div className="capitalize cursor-pointer hover:text-gray-500">{t('contract')}</div></NavLink>
                    <NavLink href={base_url+'/drop'}><div className="capitalize cursor-pointer hover:text-gray-500">{t('mint page')}</div></NavLink>
                </div>
            </div>
        </div>
    </div>

}
