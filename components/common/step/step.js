import {CheckIcon} from '@heroicons/react/outline'
import classNames from 'classnames'

export default function Step({children,step,isActive,isDone,...props}) {
    /* {
                (isDone)
                ? <div className="step-no"><CheckIcon className='icon-sm'/></div>
                : <div className="step-no">{step}</div>
            }*/
    return (
        <div className={classNames('block-step-one',{"active":isActive},{"done":isDone})}>
            <div className="step-no">{step}</div>
            {children}
            <div className='step-line'></div>
        </div>
    )
}
