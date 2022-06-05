import React from 'react';

import Field from 'components/form/field'

import Button from 'components/common/button'
import message from 'components/common/message'

import FormObserver from 'components/form/observer';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import {generateProof,getBoxhash} from 'helper/zkpay';
import withWallet from 'hocs/wallet';

@withTranslate
@withWallet
class SafeboxCreate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_adding_safebox : false
        }
        this.formRef = React.createRef();
        this.zksafebox  = null;
        this.saveSafebox = ::this.saveSafebox

    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
    }

    async saveSafebox(values) {

        const {t} =this.props.i18n;

        console.log('values',values)

        //生成证明文件
        let clear_proof_text = message.loading(t('creating proof data'));
        const proof_data = await generateProof(values.password,'0x00','0');
        const boxhash = getBoxhash(proof_data.pswHash, values.address)
        clear_proof_text();

        var that = this;

        await this.zksafebox.request({
            'text' : {
                'loading' : t('creating safebox'),
                'sent'    : t('create safebox tx sent'),
                'success' : t('create safebox successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.zksafebox.contract.setBoxhash(
                        [0,0,0,0,0,0,0,0], 0 ,0 , proof_data.proof, proof_data.pswHash, proof_data.allHash , boxhash)
                    console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_adding_safebox : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_adding_safebox : false,
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
        const {is_adding_safebox} = this.state;
        const {wallet} = this.props;

        

        let init_data = {
            'address'       :  wallet ? wallet.address : '',
            'password'      : '',
        }

        const formSchema = Yup.object().shape({
            address      : Yup.string().matches(/0x[a-fA-F0-9]{40}/,'is not ETH address').required(),
            password     : Yup.string().min(4).max(24).required(),
        });


        return <div className='bg-white my-4 rounded-lg border border-gray-300 shadow-md mb-12'>
            <Formik
                innerRef={this.formRef}
                initialValues={init_data}
                validationSchema={formSchema}
                onSubmit={this.saveSafebox}>
                {({ errors, touched }) => (
                    
                    <Form className="w-full">
                    
                    <FormObserver onChange={this.handleFormChange}/>

                    <div className="p-4 md:p-6">
                        <Field name="address" label={t("wallet address")} placeholder={t("ETH wallet address")} readOnly={true}/>
                        <Field name="password" label={t("password")} placeholder={t("password")} />
                        <div className='border-t border-gray-300 my-4' />
                        <div className="form-submit flex justify-end mt-4">
                            <Button loading={is_adding_safebox} className="btn btn-primary" type="submit">{t("create safebox")}</Button>
                        </div>

                    </div>

                </Form>
                )}
            </Formik>
        </div>
                  
    }
}

export default SafeboxCreate

