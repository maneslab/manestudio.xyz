import {CheckCircleIcon} from '@heroicons/react/solid'
import EtherscanTx from 'components/etherscan/tx';


export default function Success({text,tx_hash}) {
  return (
        <div className='rounded-lg overflow-hidden py-12'>

            <div className='flex justify-center'>
                <CheckCircleIcon className="w-24 h-24 text-green-400"/>
            </div>
            <div className='pt-8'>
                <div className='text-center font-bold text-xl mb-4'>{text}</div>
                {
                    (tx_hash)
                    ? <div className='flex justify-center text-blue-500'><EtherscanTx tx_hash={tx_hash}/></div>
                    : null
                }
            </div>

        </div>
  )
}
