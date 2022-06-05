import React from 'react';

import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import PageWrapper from 'components/pagewrapper'

import { Formik, Form } from 'formik';
import Field from 'components/form/field'
import TokenSelect from 'components/form/token_select'

import Button from 'components/common/button'
import MustConnectWallet from 'components/must_connect'
import CreateSafebox from 'components/safebox/create'

import {loadSafebox} from 'redux/reducer/safebox'
import Head from 'next/head'
import message from 'components/common/message'
import notification from 'components/common/notification'
import DepositTokenModal from 'components/safebox/deposit_modal'

import { withRouter } from 'next/router'

import * as Yup from 'yup';

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import {generateProof,getBoxhash} from 'helper/zkpay';
import {getConfig} from 'helper/config'
import Erc20  from 'helper/web3/erc20';


import WithdrawModal from 'components/safebox/withdraw_modal'

import {LockClosedIcon} from '@heroicons/react/outline'
import withWallet from 'hocs/wallet';
import { denormalize } from 'normalizr';
import {safeboxSchema} from 'redux/schema/index'


@withTranslate
@withRouter
@withWallet
class Deposit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'show_add_modal' : false,
            'update_item'    : null,

            'is_fetching_safebox' : false,
            'is_fetched_safebox' : false,
            'safebox_hash' : null,
            'is_adding_safebox' : false,

            'is_fetching_balance': false,
            'balance_map' : {
            },

            'show_withdraw_modal' : false,
            'withdraw_token_amount' : {
                value : 0,
                decimals : 0
            },

            'deposit_modal' : false,
            'deposit_data'  : {}
        }
        this.formRef = React.createRef();

        this.getUserSafeBox = ::this.getUserSafeBox
        this.depositSafebox = ::this.depositSafebox
        this.getUserSafeBoxBalance = ::this.getUserSafeBoxBalance

        this.zksafebox  = null;

    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
        const {wallet} = this.props;
        console.log('debug:wallet01',wallet)
        if (wallet && wallet.address) {
            console.log('debug:wallet',wallet)
            this.props.loadSafebox(wallet.address);
        }
    }

    componentDidUpdate(prevProps,prevState) {

        const {wallet} = this.props;
        const prev_wallet_address = (prevProps.wallet) ? prevProps.wallet.address : '';  

        if (wallet && wallet.address && wallet.address != prev_wallet_address) {
            console.log('debug:wallet02',wallet.address)
            this.props.loadSafebox(wallet.address);
        }
        // if (this.state.safebox_hash !== prevState.safebox_hash) {
        //     if (this.state.safebox_hash !== '0x0000000000000000000000000000000000000000000000000000000000000000' && this.props.login_user.get('wallet_address')) {
        //         this.getUserSafeBoxBalance(this.props.login_user.get('wallet_address'))
        //     }
        // }
    }

    async getUserSafeBox(address) {
        console.log('调用到getUserSafeBox',address)
        this.setState({
            'is_fetching_safebox' : true,
            'is_fetched_safebox' : false
        })
        let result = await this.zkpay.getUserSafeBox(address);
        console.log('调用到getUserSafeBox结果',result)

        this.setState({
            'is_fetching_safebox' : false,
            'is_fetched_safebox' : true,
            'safebox_hash'       : (result == '0x0000000000000000000000000000000000000000000000000000000000000000') ? null : result
        })
    }
    
    @autobind
    refresh() {
        this.getUserSafeBoxBalance(this.props.login_user.get('wallet_address'))
    }

    async getUserSafeBoxBalance(address) {

        this.setState({
            'is_fetching_balance' : true
        })
        let tokens = getConfig('SALARY_TOKEN_LIST');
        let token_addrs = Object.keys(tokens);

        console.log('token_addrs',token_addrs)

        let balance_result = await this.zkpay.balanceOf(address,token_addrs);

        console.log('balance_result',balance_result)

        let balance_map = {};
        await Promise.all(
            token_addrs.map(async(one,i) => {
                
                let erc20 = new Erc20(one);
                let decimals = await erc20.getDecimals();
                
                balance_map[one] = {
                    'value' : balance_result[i],
                    'decimals' : decimals
                }
            })
        )

        this.setState({
            'balance_map' : balance_map,
            'is_fetching_balance' : false
        })
        console.log('balance_map',balance_map)

    }

    @autobind
    showWithdrawModal(token_address,amount) {
        this.setState({
            show_withdraw_modal     : true,
            withdraw_token_amount   : amount,
            withdraw_token_address  : token_address
        });
    }

    @autobind
    hideWithdrawModal(token_address,amount) {
        this.setState({
            show_withdraw_modal     : false,
            withdraw_token_amount   : {
                'value' : 0,
                'decimals' : 0
            },
            withdraw_token_address  : null
        });
    }


    @autobind
    refreshList() {
        console.log('debug:refreshList',this.listRef);
        if (this.listRef && this.listRef.current) {
            this.listRef.current.refresh();
        }
    }


    async depositSafebox(values) {

        const {t} =this.props.i18n;
        const {wallet} = this.props;

        var that = this;

        if (!wallet) {
            message.error('wallet is not connected');
            return;
        }

        this.setState({
            'deposit_modal' : true,
            'deposit_data' : {
                wallet : wallet,
                ...values
            }
        })

        // let erc20 = new Erc20(values.token.address)
        // let total_amount_in_ethers = await erc20.getValueFromAmount(values.amount);


        // await this.zksafebox.request({
        //     'text' : {
        //         'loading' : t('depositing'),
        //         'sent'    : t('deposit tx sent'),
        //         'success' : t('deposit successful'),
        //     },
        //     'func' : {
        //         'send_tx' : async () => {
        //             let tx_in = await this.zksafebox.contract.recharge(
        //                 wallet.address , values.address ,values.token.address, total_amount_in_ethers )
        //             console.log('tx is send',tx_in)
        //             return tx_in;
        //         },
        //         'before_send_tx' : () => {
        //             that.setState({
        //                 is_deposting : true,
        //             })
        //         },
        //         'finish_tx' : () => {
        //             that.setState({
        //                 is_deposting : false,
        //             })
        //         },
        //         'after_finish_tx' : () => {
        //             console.log('after_is_depost_tx');
        //             // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
        //         }
        //     } 
        // })

    }

    @autobind
    toggleDepositModal() {
        this.setState({
            'deposit_modal' : !this.state.deposit_modal
        })
    }
    render() {
        const {t} = this.props.i18n;
        const {deposit_data,is_adding_safebox,deposit_modal} = this.state;
        const {safebox_data_all,entities,wallet} = this.props;

        let init_data = {
            'address'       :  wallet ? wallet.address : '',
            'amount'        : 0,
            'token'         : null
        }

        const formSchema = Yup.object().shape({
            address    : Yup.string().matches(/0x[a-fA-F0-9]{40}/,'is not ETH address').required(),
            amount     : Yup.number().required(),
            token      : Yup.object().required()
        });


        return <PageWrapper>
            <Head>
                <title>Zksafebox</title>
            </Head>
            <MustConnectWallet>
            <div className="page-wapper">

                <h1 className='h1 text-blue-500 mb-8'>{t('deposit')}</h1>
                <div className='bg-white my-4 rounded-lg border border-gray-300 shadow-md mb-12'>
                    <Formik
                        innerRef={this.formRef}
                        initialValues={init_data}
                        validationSchema={formSchema}
                        onSubmit={this.depositSafebox}>
                        {({ errors, touched }) => (
                            
                            <Form className="w-full">
                            
                            <div className="p-4 md:p-6">
                                <Field name="address" label={t("wallet address")} placeholder={t("ETH wallet address")} />
                                <TokenSelect name="token" label={t("token")} />
                                <Field name="amount" label={t("amount")} placeholder={t("amount")} />
                                <div className='border-t border-gray-300 my-4' />
                                <div className="form-submit flex justify-end mt-4">
                                    <Button loading={is_adding_safebox} className="btn btn-primary" type="submit">{t("deposit")}</Button>
                                </div>

                            </div>

                        </Form>
                        )}
                    </Formik>
                </div>

                <DepositTokenModal deposit_data={deposit_data} visible={deposit_modal} closeModal={this.toggleDepositModal}/>

            </div>
            </MustConnectWallet>
        </PageWrapper>
    }
}

// Safebox.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
//     return {
//     };
// });

const mapDispatchToProps = (dispatch) => {
    return {
        loadSafebox : (address) => {
            return dispatch(loadSafebox(address))
        },
    }
}
function mapStateToProps(state,ownProps) {

    return {
        safebox_data_all : state.getIn(['safebox','load']),
        entities         : state.get('entities')
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Deposit);

