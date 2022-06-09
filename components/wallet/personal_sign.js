import { useSignMessage } from 'wagmi'

export default function PersonalSign({message_str,handleLogin}) {

    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message   : message_str,
        onSuccess : handleLogin
    })
    
    return (
        <div className='p-4'>
          <button className='btn btn-primary' disabled={isLoading} onClick={() => signMessage()}>
            Sign message
          </button>
          {isSuccess && <div>Signature: {data}</div>}
          {isError && <div>Error signing message</div>}
        </div>
    )
}
