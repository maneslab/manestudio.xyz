import LoadingIcon from 'public/img/common/loading.svg'
import classNames from 'classnames'

export default function Button({loading,className,...props}) {
  return (
    <button className={classNames(className,{"loading":loading})} disabled={(loading)?true:false} {...props}>
      {(loading)?<LoadingIcon className="animate-spin h-5 w-5 mr-3"/>:null}
      <span>{props.children}</span>
    </button>
  )
}
