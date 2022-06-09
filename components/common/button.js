import LoadingIcon from 'public/img/common/loading.svg'
import classNames from 'classnames'

export default function Button({loading,className,...props}) {
  return (
    <button className={classNames(className,{"loading":loading})} disabled={(loading)?true:false} {...props}>
      <span>{props.children}</span>
    </button>
  )
}
