import { useSignMessage } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import useTranslation from 'next-translate/useTranslation'

export default function PersonalSign({message_str,handleLogin}) {

    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message   : message_str,
        onSuccess : handleLogin
    })
    let {t} = useTranslation('common');

    //          {isSuccess && <div>Signature: {data}</div>}

    return (
        <div className='p-4'>
          <button className='btn btn-primary' disabled={isLoading} onClick={() => signMessage()}>
            {t('sign message')}
          </button>
          {isError && <div>Error signing message</div>}
        </div>
    )
}
