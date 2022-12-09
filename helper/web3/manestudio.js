import {  ethers } from "ethers";
import config from 'helper/config'

import contract from "helper/web3/contract";
import manestudio_abi from 'helper/web3/abi/manestudio' 
import {getAmountFromValueAndDecimals} from 'helper/web3/number'

export default class manestudio extends contract{

    constructor(t = null,network = 'goerli',contract_address = '') {

        console.log('constructor-network',network);

        super(t);
        console.log('contract_address',contract_address,network)

        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.contract = new ethers.Contract(contract_address, manestudio_abi, this.provider.getSigner());
    }

    async estimateGasDeploy(...params) {


        console.log('estimateGasDepositToken调度的请求是：');

        let gasLimit = await this.contract.estimateGas.deploy(...params);

        console.log('estimateGasDepositToken得到的gasLimit是：',gasLimit);

        let gasPrice = await this.provider.getGasPrice()
        console.log('estimateGasDepositToken得到的gasLimit是：',gasPrice);


        let gasFee = gasLimit.mul(gasPrice);
        return {
            gasLimit : gasLimit,
            gasPrice : ethers.utils.formatUnits(gasPrice,'gwei'),
            gasFee   : getAmountFromValueAndDecimals(gasFee.toString(),18)
        };
    }
  
}