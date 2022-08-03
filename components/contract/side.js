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

        <h3 className='font-bold capitalize mb-4'>{t('deploy')}</h3>
        <ul>
            <li>
                <NavLink href={base_url+'/deploy?net=rinkeby'}>
                <a>
                    <div class="dot-circle"></div>
                    {'rinkeby testnet'}
                </a>
                </NavLink>
            </li>
            <li>
                <NavLink href={base_url+'/deploy?net=mainnet'}>
                <a>
                    <div class="dot-circle"></div>
                    {t('ETH mainnet')}
                </a>
                </NavLink>
            </li>
        </ul>
    </div>

}
