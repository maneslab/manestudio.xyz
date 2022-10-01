import {  ethers } from "ethers";
import contract from "helper/web3/contract";
import manenft_abi from 'helper/web3/abi/manenft' 

export default class manenft extends contract{

    constructor(t = null,network = 'goerli',contract_address) {

        // console.log('constructor-network',network);

        super(t);

        // console.log('contract_address',contract_address,network)

        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.contract = new ethers.Contract(contract_address, manenft_abi, this.provider.getSigner());
    }

    async isDeployed() {
        let result = await this.provider.getCode(this.contract.address)
        if (result == '0x') {
            return true;
        }else {
            return false;
        }
    }
}