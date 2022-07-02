import React from 'react';

import PageWrapper from 'components/pagewrapper'

import Head from 'next/head'

import useTranslation from 'next-translate/useTranslation'

import Link from 'next/link'
import { EmojiSadIcon } from '@heroicons/react/outline';

export default function FourOhFour() {

    let {t} = useTranslation('common');

    return <PageWrapper>
        <Head>
            <title>404 - Page Not Found</title>
        </Head>
        <div className='bg-white -mt-8 border-t border-gray-300'>
            <div className='max-w-screen-xl mx-auto flex justify-center flex-col items-center height-without-header' >
                
                <div className='mb-8'>
                    <EmojiSadIcon className='w-16 h-16'/>
                </div>

                <h1 className='h1 mb-2'>404 Not Found!</h1>

                <div className='mb-12'>
                    {t('looks like you run into a not exist page')}
                </div>

                <Link href="/">
                <a className='btn btn-outline'>
                    {t('back')}
                </a>
                </Link>

            </div>
        </div>
    </PageWrapper>
}
