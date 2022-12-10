import {  ethers } from "ethers";
// import config from 'helper/config'

import contract from "helper/web3/contract";
import manestudio_v1_abi from 'helper/web3/abi/manestudio_v1'
import manestudio_v2_abi from 'helper/web3/abi/manestudio_v2' 

import {getAmountFromValueAndDecimals} from 'helper/web3/number'

import {getParentContractAddress,getParentContractVersion} from 'helper/web3/tools'

export default class manestudio extends contract{

    constructor(t = null,network = 'goerli',club_id = '') {

        super(t);

        console.group('manestudio_contract');
        console.log('network',network);
        console.log('club_id',club_id);

        let contract_address = getParentContractAddress(club_id,network);
        let contract_version = getParentContractVersion(club_id);

        this.provider = new ethers.providers.Web3Provider(window.ethereum)

        console.log('contract_address',contract_address)
        console.log('contract_version',contract_version)

        console.log('manestudio_v2_abi',manestudio_v2_abi)

        switch(contract_version) {
            case 'v1':
                this.contract = new ethers.Contract(contract_address, manestudio_v1_abi, this.provider.getSigner());
            case 'v2':
                this.contract = new ethers.Contract(contract_address, manestudio_v2_abi, this.provider.getSigner());
        }

        console.groupEnd();
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