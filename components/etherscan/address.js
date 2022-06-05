import React,{useState} from 'react'
import {getShortAddress} from 'helper/common'
import {getConfig} from 'helper/config'
export default function WalletOne({
    wallet_address,
    className
}) {

    let etherscan_base = getConfig('ETHERSCAN_BASE');

    let [showTip,setShowTip] = useState(false);

    if (!wallet_address) {
        return null;
    }

    return <div className='relative'>
        {
            (showTip)
            ? <div className='absolute left-0 bg-black opacity-80 text-white bottom-6 rounded-full px-4 py-1 shadow-lg'>
                <a target={'_blank'} href={etherscan_base+"/address/"+wallet_address} className="hover:underline">{wallet_address}</a>
                <div className='tooltip-arrow'></div>
            </div>
            : null
        }
        <span className='cursor-pointer' onClick={()=>setShowTip(!showTip)}>{getShortAddress(wallet_address)}</span>
    </div>

}
