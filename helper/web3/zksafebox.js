// import { base } from '@tailwindcss/typography/src/styles';
// import autobind from 'autobind-decorator'
import { Contract, ethers } from "ethers";
import {getConfig} from 'helper/config'
import { t } from 'helper/translate';

import contract from "helper/web3/contract";

const zksafebox_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "doneNum",
        "type": "uint256"
      }
    ],
    "name": "Cover",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "boxhash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "SetBoxhash",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum ZkSafebox.CoverChoice",
        "name": "choice",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "needWalletNum",
        "type": "uint256"
      }
    ],
    "name": "SetSocialRecover",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "tokenAddrs",
        "type": "address[]"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "bals",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "coverBoxhash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "coverOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "enum ZkSafebox.CoverChoice",
        "name": "choice",
        "type": "uint8"
      }
    ],
    "name": "getRecoverWallets",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "needWallets",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "doneWallets",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "enum ZkSafebox.CoverChoice",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "owner2choice2recover",
    "outputs": [
      {
        "internalType": "enum ZkSafebox.CoverChoice",
        "name": "choice",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "needWalletNum",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "owner2safebox",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "boxhash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[8]",
        "name": "proof1",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash1",
        "type": "uint256"
      },
      {
        "internalType": "uint256[8]",
        "name": "proof2",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash2",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash2",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "boxhash2",
        "type": "bytes32"
      }
    ],
    "name": "setBoxhash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash",
        "type": "uint256"
      },
      {
        "internalType": "enum ZkSafebox.CoverChoice",
        "name": "choice",
        "type": "uint8"
      },
      {
        "internalType": "address[]",
        "name": "needWallets",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "needWalletNum",
        "type": "uint256"
      }
    ],
    "name": "setSocialRecover",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "toOwner",
        "type": "address"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      },
      {
        "internalType": "uint256",
        "name": "pswHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "tokenAddr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "allHash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "withdrawToERC20Receiver",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]


export default class zksafebox extends contract{

    constructor(t = null) {
        super(t);
        let contract_address = getConfig('ZKSAFEBOX_CONTRACT_ADDRESS');
        console.log('debug03,zksafebox_contract',contract_address)
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        this.contract = new ethers.Contract(contract_address, zksafebox_abi, provider.getSigner());
    }
  
}