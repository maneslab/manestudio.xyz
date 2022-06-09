import PropTypes from 'prop-types'
import React, { Children } from 'react'
import {getShortAddress} from 'helper/common'

const EtherscanLink = ({children,address,short}) => {

    let link = 'https://www.etherscan.io/address/' + address;
    let text = (short) ? getShortAddress(address) : address;
    return (
        <a href={link} target="_blank" className="a">
            {text}
        </a>
    )
}

EtherscanLink.propTypes = {
  address: PropTypes.string.isRequired,
}

export default EtherscanLink