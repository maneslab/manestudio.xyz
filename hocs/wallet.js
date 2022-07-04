import React, { Component } from 'react'
import { useAccount,useNetwork } from 'wagmi'

export default function withWallet(WrappedComponent) {
    return (props) => {
        const { address, isConnected } = useAccount()
        const { chain, chains } = useNetwork()
        // console.log('test-wallet',address,isConnected);
        // console.log('test-connect',chain,chains)
        return <WrappedComponent 
            wallet={{'address':address,'is_connected':isConnected}} 
            chain={chain} 
            chains={chains}
            {...props} />;
    }
}

