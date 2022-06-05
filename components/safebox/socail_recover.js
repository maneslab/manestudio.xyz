import React from 'react';

import Field from 'components/form/field'

import Button from 'components/common/button'
import message from 'components/common/message'

import { Formik, Form} from 'formik';
import * as Yup from 'yup';

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import withWallet from 'hocs/wallet';


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
        this.sendRecoveryRequest = ::this.sendRecoveryRequest
    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
    }

    async sendRecoveryRequest(values) {

        const {t} =this.props.i18n;
        const {wallet} = this.props;

        console.log('debug:values',values)
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
                'loading' : t('sending reset password request'),
                'sent'    : t('reset password tx sent'),
                'success' : t('reset password successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.zksafebox.contract.coverBoxhash(values.address)
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
        const {is_adding,recover_data,show_form,is_fetching_recover_data} = this.state;
        const {wallet} = this.props;

        

        let init_data = {
            'address'   : '',
        }

        const formSchema = Yup.object().shape({
            address: Yup.string().matches(/0x[a-fA-F0-9]{40}/,'is not ETH address').required(), // these constraints take precedence
        });


        return  <div>
            <Formik
            innerRef={this.formRef}
            initialValues={init_data}
            validationSchema={formSchema}
            onSubmit={this.sendRecoveryRequest}>
            {() => (
                
                <Form className="w-full">
                
                <div className="p-4">
                    <Field name="address" label={t("wallet address")} placeholder={t("input which safebox you wanna helper to reset password")} />
                    <div className='border-t border-gray-300 my-4' />
                    <div className="form-submit flex justify-end mt-4">
                        <Button loading={is_adding} className="btn btn-primary" type="submit">{t("send reset passwor request")}</Button>
                    </div>

                </div>

            </Form>
            )}
        </Formik>

        </div>

                  
    }
}

export default SafeboxCreate

