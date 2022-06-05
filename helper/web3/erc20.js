import autobind from 'autobind-decorator'
import { ethers } from "ethers";
import contract from 'helper/web3/contract'
import {getAmountFromValueAndDecimals,getValueFromAmountAndDecimals} from 'helper/web3/number.js'
import { erc20ABI } from 'wagmi';

export default class Erc20 extends contract {

    constructor(contract_address, t = null) {
        super(t);
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = this.provider.getSigner();
        this.contract_address = contract_address
        this.contract = new ethers.Contract(contract_address, erc20ABI, signer);
        this.decimals = null;
    }

    async getAmountFromValue(value) {
        let decimals = await this.getDecimals();
        return getAmountFromValueAndDecimals(value,decimals);
    }

    @autobind
    async getValueFromAmount(amount) {
        let decimals = await this.getDecimals();
        return getValueFromAmountAndDecimals(amount,decimals);
    }

    @autobind
    async amountBalanceOf(address) {
        let balance = await this.balanceOf(address);
        let amount = await this.getAmountFromValue(balance);
        return amount
    }

    @autobind
    async getDecimals() {
        console.log('this.contract_address',this.contract_address)
        if (!this.decimals ) {
            this.decimals = await this.contract.decimals();
        }
        return this.decimals;
    }
   
}