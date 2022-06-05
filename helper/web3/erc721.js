import autobind from 'autobind-decorator'
import { ethers } from "ethers";
import notification from 'components/common/notification'

import { erc721ABI } from 'wagmi';

export default class Erc721 {

    constructor(contract_address) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.contract_address = contract_address
        this.contract = new ethers.Contract(contract_address, erc721ABI, this.provider);
    }

    @autobind
    async ownerOf(token_id) {
        let owner = await this.contract.ownerOf(token_id);
        console.log('debug,owner',token_id,owner)
        return owner;
    }


    async checkApproveForAll(owner_address,approve_address) {
        let is_approve = await this.contract.isApprovedForAll(owner_address,approve_address);
        console.log('debug,is_approve',is_approve,owner_address,approve_address)
        
        return is_approve;
    }

    async setApprovalForAll(approve_address,is_approve = true, options = {}) {

        const signer = this.provider.getSigner()

        const contractWithSigner = this.contract.connect(signer);

        console.log('debug:contract_address',this.contract_address);
        console.log('debug:approve_address',approve_address);
        console.log('debug:is_approve',is_approve);
        console.log('debug:contractWithSigner',contractWithSigner);

        let tx = null
        try {
            tx = await contractWithSigner.setApprovalForAll(approve_address, is_approve);

            ///交易被发出
            console.log('debug,交易发出',tx)
            notification.info({
                'message' : 'tx sent',
                'description' : 'waiting for the transaction to be executed',
            })
            ///等待交易执行
            await tx.wait();

            notification.remove(tx.hash);

            notification.success({
                'key' : tx.hash,
                'message' : 'tx success',
                'description' : 'transaction successfully executed',
                'duration' : 5
            })

            console.log('debug,交易被执行',tx)
            if (options.onSuccess) {
                options.onSuccess(tx);
            }

            return tx;
        }catch(e) {


        }finally {
            
        }

        if (options.onError) {
            options.onError();
        }

        // console.log('debug-error',e)
        notification.error({
            message: 'Authorization rejected',
            description : 'You need authorization to place a pending trade',
        })
        return false;
    }



}