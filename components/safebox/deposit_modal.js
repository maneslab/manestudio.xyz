import React from 'react';

import classNames from 'classnames';

import Modal from 'components/common/modal'
import Loading from 'components/common/loading'
import Button from 'components/common/button'


import {withTranslate} from 'hocs/index'
import {getConfig} from 'helper/config'

import Erc20  from 'helper/web3/erc20'
import notification from 'components/common/notification'
import Zksafebox from 'helper/web3/zksafebox';
import Success from 'components/common/success'

import withWallet from 'hocs/wallet';

@withWallet
@withTranslate
class DepositTokenModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deposit_contrat_address : getConfig('ZKSAFEBOX_CONTRACT_ADDRESS'),
            page                    : 'step1',
            checking_approve_amount : false,
            sending_approve_tx      : false,
            sending_deposit_tx      : false,
            deposit_tx_hash         : 'test'
        }
        this.checkApproveAmount = ::this.checkApproveAmount
        this.approveAmount = ::this.approveAmount
        this.depositToken = ::this.depositToken

    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.visible && !prevProps.visible) {
            this.checkApproveAmount(this.props.deposit_data.token.address,this.props.deposit_data.amount);
        }
    }

    async checkApproveAmount(contract_address,total_amount) {

        const {wallet} = this.props;
        const {deposit_contrat_address} = this.state;
        // console.log('wallet',wallet);
        // console.log('debug:checkApproveAmount',contract_address,total_amount);

        const {login_user} = this.props;

        this.setState({
            'checking_approve_amount'  : true
        })


        let erc20 = new Erc20(contract_address)
        let allowance = await erc20.contract.allowance(wallet.address,deposit_contrat_address)

        ///把total_amount转换为bn的数据
        let total_amount_in_ethers = await erc20.getValueFromAmount(total_amount);

        console.log('debug03,当前批准的金额是:',allowance.toString(),deposit_contrat_address);

        if (allowance.lt(total_amount_in_ethers)) {
            this.setState({
                'checking_approve_amount' : false
            })
        }else {
            this.setState({
                'page' : 'step2'
            })
        }


    }
    
    async approveAmount(contract_address,amount) {

        const {deposit_data,wallet} = this.props;
        const {deposit_contrat_address} = this.state;
        const {t} = this.props.i18n;

        // console.log('approve_request',contract_address,amount)
        let erc20 = new Erc20(contract_address,t)

        // let token_name = deposit_data['token']['symbol'];
        let total_amount_in_ethers = await erc20.getValueFromAmount(amount);

        console.log('debug:approve',total_amount_in_ethers);

        var that = this;

        await erc20.request({
            'text' : {
                'loading' : t('calling metamask'),
                'sent'    : t('approve tx sent'),
                'success' : t('approve successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx = await erc20.contract.approve(deposit_contrat_address,total_amount_in_ethers);
                    return tx;
                },
                'before_send_tx' : () => {
                    that.setState({
                        sending_approve_tx : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        sending_approve_tx : false,
                        page : 'step2'
                    })
                },
                'after_finish_tx' : (tx) => {
                    // this.setState({
                    //     'deposit_tx_hash' : tx.hash
                    // })
                }
            } 
        })


    }

    async depositToken() {

        const {t} =this.props.i18n;
        const {wallet,deposit_data} = this.props;
        const {token,amount,address} = deposit_data;

        if (!wallet || !wallet.address)  {
            notification.error({
                'message' : t('deposit error'),
                'description' : t('wallet is not connected'),
            })
            return;
        }

        let erc20 = new Erc20(token.address,t)
        let amount_value  = await erc20.getValueFromAmount(amount);

        let zksafebox = new Zksafebox(t);
        console.log('zksafebox.contract',zksafebox.contract);
        var that = this;

        await zksafebox.request({
            'text' : {
                'loading' : t('depositing'),
                'sent'    : t('deposit tx sent'),
                'success' : t('deposit successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await zksafebox.contract.deposit(
                        wallet.address , address ,token.address, amount_value )
                    console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        sending_deposit_tx : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        sending_deposit_tx : false,
                        page : 'step3'
                    })
                },
                'after_finish_tx' : (tx) => {
                    console.log('after_is_depost_tx');
                    this.setState({
                        'deposit_tx_hash' : tx.hash
                    })
                }
            } 
        })


    }



    render() {
        const {page} = this.state;
        const {visible,deposit_data} = this.props;
        const {t} = this.props.i18n;

        if (!visible) {
            return null;
        }

        console.log('deposit_data',deposit_data)

        let token_name = deposit_data['token']['symbol']
        let contract_address = deposit_data['token']['address']
        let total_amount = deposit_data['amount']

        let footer_com = null
        if (page == 'step1') {
            footer_com = <div className='py-8'>
                {
                    (this.state.approve_ing || this.state.checking_approve_amount) 
                    ? <Loading />
                    : <div className='flex justify-center items-center mt-4'>
                        <Button loading={this.state.sending_approve_tx} className='btn btn-primary' onClick={this.approveAmount.bind({},contract_address,total_amount)}>appove {total_amount.toString()} {token_name}</Button>
                    </div>
                }
            </div>
        }else if (page == 'step2') {
            footer_com = <div className='py-8'>
                <div className='flex justify-center items-center mt-4'>
                    <Button loading={this.state.sending_deposit_tx} className='btn btn-primary' onClick={this.depositToken}>{t('deposit')}</Button>
                </div>
            </div>
        }


        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <h2 className='h2 text-center mb-4'>{t('deposit token')}</h2>
                  
                    {
                        (page == 'step3')
                        ? <Success text={t('deposit success')}  tx_hash={this.state.deposit_tx_hash}/>
                        : <div className='border-2 border-blue-400 rounded-lg overflow-hidden'>

                            <div className='block-step-1 overflow-hidden'>
                                <div className={classNames("step-one",{"active":page == 'step1'})}>
                                    <div className='t'><div className='ti'>Step.1</div></div>
                                    <div className='c'>{t('approve token')}</div>
                                </div>
                                <div className={classNames("step-one",{"active":page == 'step2'})}>
                                    <div className='t'><div className='ti'>Step.2</div></div>
                                    <div className='c'>{t('deposit')}</div>
                                </div>
                            </div>

                            {
                                footer_com
                            }

                        </div>
                    }
                    

                    
                </Modal>
    }

    
}



export default DepositTokenModal

