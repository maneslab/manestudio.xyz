import {  ethers } from "ethers";

export default class misc {

    constructor() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
    }

    async getBalance(address) {
        let balance = await this.provider.getBalance(address)
        return ethers.utils.formatEther(balance)
    }
}