import {useState} from 'react'
import classNames from 'classnames'
import {percentDecimal} from 'helper/number'
import {InformationCircleIcon}from '@heroicons/react/outline'
import useTranslation from 'next-translate/useTranslation'
import {t} from 'helper/translate';

export default function UniqueRatio({
    value
}) {
    const [isShown, setIsShown] = useState(false);
    const { t } = useTranslation('common');

    return <div className='flex justify-start items-center'>

        <div className={classNames(
            {'text-green-500':value <= 0.1},
            {'text-yellow-500':(value <= 0.3 && value > 0.1)},
            {'text-red-500':value > 0.3},
        )}>{percentDecimal(value)} %</div>

        <div className='ml-2 flex items-center relative' 
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}>
            <InformationCircleIcon className="w-5 h-5" />
            {
                (isShown)
                ? <div className='absolute w-96 d-bg-c-1 border d-border-c-1 p-4 bottom-5 shadow-lg z-100'>
                    <h3 className='font-bold mb-2'>{t('what is repetition rate?')}</h3>
                    <div className='text-sm'>
                        <div className='font-bold mb-2'>{t('repetition-rate-intro')}</div>
                        <div className='flex justify-start mb-2'>
                            <span className='text-green-500 mr-4 w-1/3 block'>{"rate < 10%"}</span>
                            <span className='w-2/3 block'>{t('Repetition-rate-cond-1')}</span>
                        </div>
                        <div className='flex justify-start mb-2'>
                            <span className='text-yellow-500 mr-4 w-1/3 block'>{"10%< rate <30%"}</span>
                            <span className='w-2/3 block'>{t('Repetition-rate-cond-2')}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='text-red-500 mr-4 w-1/3 block'>{"rate > 30%"}</span>
                            <span className='w-2/3 block'>{t('Repetition-rate-cond-3')}</span>
                        </div>
                    </div>
                </div>
                : null
            }
            
        </div>
    </div>
}
