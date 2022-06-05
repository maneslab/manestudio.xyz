import React from 'react';

import autobind from 'autobind-decorator'
import Field from 'components/form/field'
import Button from 'components/common/button'
import Modal from 'components/common/modal'

import FormObserver from 'components/form/observer';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import message from 'components/common/message'

import { withRouter } from 'next/router'

import {withTranslate} from 'hocs/index'
import { getTokenName } from 'helper/token';
import { getAmountFromValueAndDecimals,getValueFromAmountAndDecimals } from 'helper/web3/number';
import {autoDecimal} from 'helper/number'
import zksafebox from 'helper/web3/zksafebox'
import {CheckCircleIcon} from '@heroicons/react/solid'

import notification from 'components/common/notification'
import {generateProof} from 'helper/zkpay';
import {BigNumber} from 'ethers'
import EtherscanTx from 'components/etherscan/tx'

// @withRouter

@withTranslate
class SalaryWithdrawModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sending_withdraw_tx : false,
            withdraw_tx_hash    : null,
            page : 'init'
        }
        this.formRef = React.createRef();
        this.withdraw = ::this.withdraw
    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
    }

    componentDidUpdate(prevProps,preState) {
        if (this.state.visible !== preState.visible) {
            this.setState({
                'page' : 'init'
            });
        }
    }


    async withdraw(values) {
        console.log('debug:values',values)

        const {t} =this.props.i18n;
        const {token,wallet,token_address} = this.props;

        if (!wallet || !wallet.address)  {
            notification.error({
                'message' : t('withdraw error'),
                'description' : t('wallet is not connected'),
            })
            return;
        }

        let token_value = getValueFromAmountAndDecimals(values.amount,token.get('decimals'))

        let clear_proof_text = message.loading(t('creating proof data'));
        const proof_data = await generateProof(values.password,token_address,token_value.toString());
        clear_proof_text();

        var that = this;

        console.log('debug:token_value',token_value)

        var that = this;

        await this.zksafebox.request({
            'text' : {
                'loading' : t('withdrawing'),
                'sent'    : t('withdraw tx sent'),
                'success' : t('withdraw successful'),
            },
            'func' : {
                'send_tx' : async () => {

                    console.log('debug01,proof',proof_data.proof)
                    console.log('debug01,pswHash',proof_data.pswHash)
                    console.log('debug01,token_address',token_address)
                    console.log('debug01,token_value',token_value)
                    console.log('debug01,allHash',proof_data.allHash)
                    console.log('debug01,address',values.address)

                    let tx_in = await this.zksafebox.contract.withdraw(
                        proof_data.proof,
                        proof_data.pswHash,
                        token_address, 
                        token_value,
                        proof_data.allHash,
                        values.address )
                    console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        sending_withdraw_tx : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        sending_withdraw_tx : false,
                        page : 'success'
                    })
                },
                'after_finish_tx' : (tx) => {
                    this.setState({
                        'withdraw_tx_hash' : tx.hash
                    })

                    if (typeof this.props.after_success == 'function') {
                        this.props.after_success()
                    }
                }
            } 
        })


        // //2.调用发工资的合约
        // let clear_msg;
        // let tx;
        // try {

        //     //生成证明文件
        //     let clear_proof_text = message.loading(t('creating proof data'));

        //     console.log('values.token_address',token_address)
        //     console.log('values.password',values.password)
        //     console.log('values.token_value',token_value.toString())

        //     const proof_data = await generateProof(values.password,token_address,token_value.toString());
        //     clear_proof_text();


        //     clear_msg = message.loading(t('waiting for calling metamask'));

        //     tx = await this.zkpay.withdraw(proof_data.proof, proof_data.pswHash, token_address, token_value,proof_data.allHash,values.address)
            
        //     clear_msg();
                      
        //     notification.info({
        //         'message' : t('withdraw tx sent'),
        //         'description' : t('waiting for the transaction to be executed'),
        //     })

        //     this.setState({
        //         sending_withdraw_tx : true
        //     })
            
        //     await tx.wait();
    
        //     notification.remove(tx.hash);

        //     this.setState({
        //         sending_withdraw_tx : false,
        //         withdraw_tx_hash :tx.hash,
        //         page : "success"         
        //     })
    
        //     notification.success({
        //         'key' : tx.hash,
        //         'message' : 'tx success',
        //         'description' : 'successful withdraw from safebox',
        //         'duration' : 5
        //     })

        //     if (this.props.refresh) {
        //         this.props.refresh();
        //     }

        // }catch(e) {
        //     console.log('debug:e',e);
        //     notification.error({
        //         message: t('tx failed'),
        //         description : e.message,
        //     })

        //     if (clear_msg) {
        //         clear_msg();
        //     }
        // }

    }


    render() {
        const {is_adding} = this.state;
        const {visible,token} = this.props;
        const {t} = this.props.i18n;

        if (!token) {
            return null;
        }
        console.log('debug:wallet02',this.props)

        const formSchema = Yup.object().shape({
            address     : Yup.string().matches(/0x[a-fA-F0-9]{40}/,'is not ETH address').required(),
            amount      : Yup.number().required(),
            password    : Yup.string().min(4).max(24).required(),
        });

        let init_data = {
            'address'           : '',
            'amount'            : '',
            'password'          : ''
        }

        console.log('debug:token',token.toJS());

        let max_amount = autoDecimal(getAmountFromValueAndDecimals(token.get('value').toString(),token.get('decimals')).toString())

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    {
                        (this.state.page == 'success')
                        ? <div className='border-2 border-green-400 rounded-lg overflow-hidden py-12'>

                            <div className='flex justify-center'>
                                <CheckCircleIcon className="w-24 h-24 text-green-400"/>
                            </div>
                            <div className='pt-8'>
                                <div className='text-center font-bold text-xl mb-4'>{t('pay success')}</div>
                                <div className='flex justify-center text-blue-500'><EtherscanTx tx_hash={this.state.withdraw_tx_hash}/></div>
                            </div>

                        </div>
                        : <Formik
                            innerRef={this.formRef}
                            initialValues={init_data}
                            validationSchema={formSchema}
                            onSubmit={this.withdraw}>
                            {({ errors, touched }) => (
                                
                                <Form className="w-full">
                                
                                <FormObserver onChange={this.handleFormChange}/>

                                

                                <div className="p-4 md:p-6">
                                    <h2 className='h2 mb-4'>{
                                        t('withdraw from safebox')
                                    }</h2>
                                    <div className='bg-yellow-100 p-4 rounded-lg my-4 flex justify-start text-sm'>
                                        <div className='mr-4'>{token.get('symbol')}</div>
                                        <div>{t('safebox balance')}: {max_amount.toString()}</div>
                                    </div>

                                    <Field name="address" label={t("to address")} placeholder={t("wallet address")} />
                                    <Field name="amount" label={t("amount")} placeholder={t("amount")} />

                                    <Field name="password" label={t("password")} placeholder={t("password")} />

                                   

                                    <div className='border-t border-gray-300 my-4' />
                                    <div className="form-submit flex justify-end mt-4">
                                        <Button loading={this.state.sending_withdraw_tx} className="btn btn-primary" type="submit">{t("submit")}</Button>
                                    </div>

                                </div>

                            </Form>
                            )}
                        </Formik>
                    }
                    
                </Modal>
    }

    
}


export default SalaryWithdrawModal

