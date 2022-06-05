import React from 'react';

import Field from 'components/form/field'

import Button from 'components/common/button'
import message from 'components/common/message'
import Loading from 'components/common/loading'

import FormObserver from 'components/form/observer';

import { Formik, Form,FieldArray ,ErrorMessage} from 'formik';
import * as Yup from 'yup';

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import {generateProof,getBoxhash} from 'helper/zkpay';
import withWallet from 'hocs/wallet';
import autobind from 'autobind-decorator';
import {ShieldCheckIcon,ClipboardCheckIcon} from '@heroicons/react/outline'
import {strFormat} from 'helper/translate'

@withTranslate
@withWallet
class SafeboxCreate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'is_adding' : false,
            'recover_data' : null,
            'is_fetching_recover_data' : false,
            'show_form' :false
        }
        this.formRef = React.createRef();
        this.zksafebox  = null;
        this.saveSocailRecovery = ::this.saveSocailRecovery
        this.getRecoverData = ::this.getRecoverData;
    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
        this.getRecoverData(this.props.wallet.address);
    }

    async getRecoverData(wallet_address) {
        console.log('debug:getRecoverData',wallet_address)

        this.setState({
            'is_fetching_recover_data' : true
        })

        try {
            
            let data = await this.zksafebox.contract.getRecoverWallets(wallet_address,0)
            let data2 = await this.zksafebox.contract.owner2choice2recover(wallet_address,0)
          
            console.log('debug:data',data)
            console.log('debug:data2',data2)

            this.setState({
                'recover_data' : {
                    'done_wallets' : data.doneWallets,
                    'need_wallets' : data.needWallets,
                    'need_wallet_number' : data2.needWalletNum
                }
            })

        }catch(e) {
        }

        this.setState({
            'is_fetching_recover_data' : false
        })
    }

    async saveSocailRecovery(values) {

        const {t} =this.props.i18n;
        const {wallet} = this.props;

        console.log('debug:values',values)

        if (Number(values.require_number) > values.wallets.length) {
            message.error('require number is over the wallet count');
            return;
        }

        let clear_proof_text = message.loading(t('creating proof data'));
        const proof_data = await generateProof(values.password,'0x00','0');
        const boxhash = getBoxhash(proof_data.pswHash, wallet.address)
        clear_proof_text();

        let addrs = [];

        values.wallets.map(one=>{
            addrs.push(one.address);
        })

         // function setSocialRecover(
        //     uint[8] memory proof,
        //     uint pswHash,
        //     uint allHash,
        //     CoverChoice choice,
        //     address[] memory needWallets,
        //     uint needWalletNum
        // ) public {

        //生成证明文件
        var that = this;

        await this.zksafebox.request({
            'text' : {
                'loading' : t('creating socail recovery'),
                'sent'    : t('create socail recovery tx sent'),
                'success' : t('create socail recovery successful'),
            },
            'func' : {
                'send_tx' : async () => {

                    let choice = 0;
                    console.log('proof_data.proof',proof_data.proof)
                    console.log('proof_data.pswHash',proof_data.pswHash)
                    console.log('proof_data.allHash',proof_data.allHash)
                    console.log('choice',choice)
                    console.log('addrs',addrs)
                    console.log('require_number',values.require_number)

                    let tx_in = await this.zksafebox.contract.setSocialRecover(proof_data.proof, proof_data.pswHash, proof_data.allHash ,choice, addrs,values.require_number)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_adding : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_adding : false,
                    })
                },
                'after_finish_tx' : () => {
                    console.log('after_finish_tx');
                    // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
                }
            } 
        })


    }


    render() {
        const {t} = this.props.i18n;
        const {is_adding,recover_data,show_form,is_fetching_recover_data,done_wallets} = this.state;
        const {wallet} = this.props;

        

        let init_data = {
            'wallets'   : [
            ],
            'require_number'    : '',
            'password'          : ''
        }

        const formSchema = Yup.object().shape({
            wallets      : Yup.array()
                .of(
                Yup.object().shape({
                    address: Yup.string().matches(/0x[a-fA-F0-9]{40}/,'is not ETH address').required(), // these constraints take precedence
                })
                )
                .required('Must have wallets'), // these constraints are shown if and only if inner constraints are satisfied
               
            require_number     : Yup.number().required(),
            password     : Yup.string().min(4).max(24).required(),

        });


        if (is_fetching_recover_data) {
            return <div>
                <Loading />
            </div>
        }

        let recover_form = <Formik
        innerRef={this.formRef}
        initialValues={init_data}
        validationSchema={formSchema}
        onSubmit={this.saveSocailRecovery}>
        {({ values }) => (
            
            <Form className="w-full">
            
            <div className="p-4">
                <FieldArray name="wallets">
                {({ insert, remove, push }) => {
                    console.log('values',values)
                    return(
                    <div className='mb-6'>
                        <label className='label'><span className='label-text'>{t('wallet address')}</span></label>
                        {values.wallets.length > 0 &&
                        values.wallets.map((vallet, index) => (
                            <div className="flex justify-between" key={index}>
                            <div className="flex-grow mr-2">
                                <Field
                                name={`wallets.${index}.address`}
                                placeholder={'ETH wallet address'}
                                type="text"
                                />
                                <ErrorMessage
                                name={`wallets.${index}.name`}
                                component="div"
                                className="field-error"
                                />
                            </div>
                            <div className="col">
                                <button
                                type="button"
                                className="btn btn-default"
                                onClick={() => remove(index)}
                                >
                                {t('remove')}
                                </button>
                            </div>
                            </div>
                        ))}
                        <div>
                            <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => push({ address: '' })}
                            >
                            {t('add wallet')}
                            </button>
                        </div>
                    </div>
                )} }
                </FieldArray>
                <Field name="require_number" label={t("require wallet number")} placeholder={t("how many wallet signatures are required to recovery password")} />
                <Field name="password" label={t("password")} placeholder={t("password")} />
                <div className='border-t border-gray-300 my-4' />
                <div className="form-submit flex justify-end mt-4">
                    <Button loading={is_adding} className="btn btn-primary" type="submit">{t("create social recovery")}</Button>
                </div>

            </div>

        </Form>
        )}
    </Formik>

    let finished_wallet = [];
    if (recover_data && recover_data.done_wallets) {
        recover_data.done_wallets.forEach(one=>{
            if (parseInt(one,16) > 0) {
                finished_wallet.push(one);
            }
        })
    }

        if (recover_data && recover_data.need_wallets.length > 0) {
            return <div>
                <div className='flex justify-between divide-x-2 divide-gray-200'>
                    <div className='w-1/2 text-center py-12'>
                        <div className='mb-4'>   
                            <ShieldCheckIcon className='icon-base text-green-500 mx-auto' />
                        </div>
                        <div className='text-green-500'>{t('social recovery has been set up')}</div>
                    </div>
                    <div className='w-1/2 text-center flex flex-col justify-center'>
                    <h3 className='font-bold uppercase text-green-500'>{t('allowed wallet')}</h3>
                        {recover_data.need_wallets.map(one=>{
                            return <div key={one} className="text-center">{one}</div>
                        })}
                        <div className='my-6 border-t border-gray-200'></div>
                        <div className='text-gray-600'>{strFormat(t('requires {count} wallet signatures to reset password'),{count:recover_data.need_wallet_number})}</div>
                    </div>
                </div>
                {
                    (finished_wallet.length > 0) 
                    ? <div className='p-4 bg-yellow-100 my-6'>
                        <h2 className='font-bold text-base'>进入社交恢复流程</h2>
                        <div className='flex justify-between divide-x-2 divide-yellow-300'>
                            <div className='w-1/2 text-center py-12'>
                            <div className='mb-4'>   
                                <ClipboardCheckIcon className='icon-base text-yellow-500 mx-auto' />
                            </div>
                            <div className='text-yellow-500'>{strFormat(t('signed wallet count : {count}'),{count:finished_wallet.length})}</div>
                        </div>
                        <div className='w-1/2 text-center flex flex-col justify-center'>
                        <h3 className='font-bold text-yellow-600 uppercase'>{t('signed wallet')}</h3>
                        {finished_wallet.map(one=>{
                            return <div key={one} className="text-center">{one}</div>
                        })}
                    </div>
                        </div>
                    </div>
                    : null
                }
                <div className='my-6 border-t border-gray-200'></div>
                {
                    (show_form)
                    ? recover_form
                    : <div className='flex justify-start'>
                        <button className='btn btn-default' onClick={()=>{this.setState({'show_form':true})}}>{t('reset socail recovery wallets')}</button>
                    </div>
                }
            </div>
        }


       

        return <div className=''>
            {recover_form}
        </div>
                  
    }
}

export default SafeboxCreate

