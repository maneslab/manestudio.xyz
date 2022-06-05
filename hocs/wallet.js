import React, { Component } from 'react'
import { useAccount } from 'wagmi'

export default function withWallet(WrappedComponent) {
    return (props) => {
        const { data, isError, isLoading } = useAccount()
        return <WrappedComponent wallet={data} wallet_error={isError} wallet_loading={isLoading} {...props} />;
    }
}

