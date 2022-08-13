import PropTypes from 'prop-types'
import React from 'react'
import {getShortAddress} from 'helper/common'

const EtherscanLink = ({address,short,network}) => {

    let base_url = '';
    switch(network) {
        case 'mainnet':
            base_url = 'https://www.etherscan.io';
            break;
        case 'rinkeby':
            base_url = 'https://rinkeby.etherscan.io/';
            break;
        case 'kovan':
            base_url = 'https://kovan.etherscan.io';
            break;
        default:
            base_url = 'https://www.etherscan.io';
            break;
    }

    let link = base_url + '/address/' + address;
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