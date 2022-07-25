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
    // const { t } = useTranslation('common');

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
                ? <div className='absolute w-96 h-48 d-bg-c-1 border d-border-c-1 p-4 bottom-5 shadow-lg z-100'>
                    <h3 className='font-bold mb-2'>what is unique ratio?</h3>
                    <div className='text-sm'>
                        <div className='font-bold mb-2'>unique ratio = collection size / max generatable;</div>
                        <div>
                            <span className='text-green-500 mr-4'>{"ratio < 10%"}</span>
                            <span>{t('Not too much repetition rate Nice project')}</span>
                        </div>
                        <div>
                            <span className='text-yellow-500 mr-4'>{"10% < ratio< 30%"}</span>
                            <span>{t('Repetition rate average Ordinary items')}</span>
                        </div>
                        <div>
                            <span className='text-red-500 mr-4'>{"ratio > 30%"}</span>
                            <span>{t('Repetition rate is poor Not very good')}</span>
                        </div>
                    </div>
                </div>
                : null
            }
            
        </div>
    </div>
}
