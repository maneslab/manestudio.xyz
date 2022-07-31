import { CopyToClipboard } from 'react-copy-to-clipboard';
import message from 'components/common/message'

export default function CopyText({text,children,onSuccessText}) {

  return (
    <CopyToClipboard text={text}
        onCopy={() => {
            message.success(onSuccessText?onSuccessText:'copy successful');
        }}>
        {
          (children)
          ? children
          : <a className="btn btn-default">{'copy'}</a>
        }
    </CopyToClipboard>
  )
}
