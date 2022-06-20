import {CheckIcon} from '@heroicons/react/outline'
import classNames from 'classnames'
import Link from 'next/link'

export default function Step({children,step,href,isActive,isDone,...props}) {
    /* {
                (isDone)
                ? <div className="step-no"><CheckIcon className='icon-sm'/></div>
                : <div className="step-no">{step}</div>
            }*/
    return (
        <div className={classNames('block-step-one',{"active":isActive},{"done":isDone})}>
            <div className="step-no">{step}</div>
            {
                (isDone)
                ? <Link href={href}><a>{children}</a></Link>
                : <a>{children}</a>
            }
            <div className='step-line'></div>
        </div>
    )
}
