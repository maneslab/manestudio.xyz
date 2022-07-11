import React from 'react'
import NavLink from 'components/common/navlink'
import useTranslation from 'next-translate/useTranslation'

import { BeakerIcon, DocumentTextIcon ,CloudUploadIcon } from '@heroicons/react/outline'

export default function ContractSide({
    club_id
}) {
    const { t } = useTranslation('common')
    let base_url = '/project/'+club_id;

    return <div className='block-left-menu'>
        <h3 className='font-bold capitalize mb-4'>{t('setting')}</h3>
        <ul>
            <li>
                <NavLink href={base_url+'/contract'}>
                <a>
                    <DocumentTextIcon className='icon-sm mr-2' />
                    {t('setting')}
                </a>
                </NavLink>
            </li>
        
        </ul>
        <div className='divider' />
        <h3 className='font-bold capitalize mb-4'>{t('test deploy')}</h3>
        <ul>
            <li>
                <NavLink href={base_url+'/deploy?net=kovan'}>
                <a>
                    <CloudUploadIcon className='icon-sm mr-2' />
                    {t('kovan')}
                </a>
                </NavLink>
            </li>
            <li>
                <NavLink href={base_url+'/deploy?net=ropsten'}>
                <a>
                    <CloudUploadIcon className='icon-sm mr-2' />
                    {t('ropsten')}
                </a>
                </NavLink>
            </li>
        </ul>
        <div className='divider' />
        <h3 className='font-bold capitalize mb-4'>{t('deploy')}</h3>
        <ul>
            <li>
                <NavLink href={base_url+'/deploy?net=mainnet'}>
                <a>
                    <CloudUploadIcon className='icon-sm mr-2' />
                    {t('ETH mainnet')}
                </a>
                </NavLink>
            </li>
        </ul>
    </div>

}
