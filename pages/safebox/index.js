import React from 'react';

import { connect } from 'react-redux'
import autobind from 'autobind-decorator';
import PageWrapper from 'components/pagewrapper'

import Loading from 'components/common/loading'

import MustConnectWallet from 'components/must_connect'
import CreateSafebox from 'components/safebox/create'

import {loadSafebox} from 'redux/reducer/safebox'
import Head from 'next/head'
import message from 'components/common/message'
import notification from 'components/common/notification'
import SafeboxBalance from 'components/safebox/balance'
import ResetPassword from 'components/safebox/reset_password'

import { withRouter } from 'next/router'


import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import {generateProof,getBoxhash} from 'helper/zkpay';
import {getConfig} from 'helper/config'
import Erc20  from 'helper/web3/erc20';



import {LockClosedIcon} from '@heroicons/react/outline'
import withWallet from 'hocs/wallet';
import { denormalize } from 'normalizr';
import {safeboxSchema} from 'redux/schema/index'
import {isBoxEmpty,isBoxPasswordEmpty} from 'helper/zkpay'


@withTranslate
@withRouter
@withWallet
class Safebox extends React.Component {

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
            }
        }
        this.formRef = React.createRef();

        this.getUserSafeBox = ::this.getUserSafeBox
        this.saveSafebox = ::this.saveSafebox
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
    
    // @autobind
    // refresh() {
    //     this.getUserSafeBoxBalance(this.props.login_user.get('wallet_address'))
    // }

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
    refresh() {
        const {wallet} = this.props;
        if (wallet && wallet.address) {
            this.props.loadSafebox(wallet.address);
        }
    }


    async saveSafebox(values) {

        const {t} =this.props.i18n;

        console.log('values',values)

        //生成证明文件
        let clear_proof_text = message.loading(t('creating proof data'));
        const proof_data = await generateProof(values.password,'0x00','0');
        clear_proof_text();

        //1.循环拿到列表并组织数据
        let tx;
        let clear_create_msg;
        try {

            clear_create_msg = message.loading(t('creating safebox'));

            let boxhash = getBoxhash(proof_data.pswHash, values.address)

            tx = await this.zkpay.register(boxhash, proof_data.proof, proof_data.pswHash, proof_data.allHash)
            
            clear_create_msg();

            notification.info({
                'message' : t('create safebox tx sent'),
                'description' : t('waiting for the transaction to be executed'),
            })

            this.setState({
                is_adding_safebox : true
            })
            
            await tx.wait();

            notification.remove(tx.hash);

            this.setState({
                is_adding_safebox : false,
            })

            notification.success({
                'key' : tx.hash,
                'message' : 'tx success',
                'description' : 'successful create safebox',
                'duration' : 5
            })

            if (this.props.login_user) {
                this.getUserSafeBox(this.props.login_user.get('wallet_address'));
            }

        }catch(e) {
            console.log('debug:e',e);
            notification.error({
                message: t('tx failed'),
                description : e.message,
            })

            if (clear_create_msg) {
                clear_create_msg();
            }
        }


    }


    render() {
        const {t} = this.props.i18n;
        // const {safebox_hash,is_adding_safebox,balance_map,is_fetching_balance} = this.state;
        const {safebox_data_all,entities,wallet} = this.props;

        
        console.log('debug03,wallet-render',wallet)
        let safebox_data = null;
        if (wallet && wallet.address) {
            safebox_data = safebox_data_all.get(wallet.address);
        }        
        
        let safebox = null;
        if (safebox_data) {
            safebox = denormalize(safebox_data.get('result'),safeboxSchema,entities);
        }
        if (safebox) {
            console.log('debug03,safebox',safebox.toJS())
        }
        console.log('debug:wallet01',wallet)

        return <PageWrapper>
            <Head>
                <title>Zksafebox</title>
            </Head>
            <MustConnectWallet>
            <div>
            <div className="page-wapper">
                {
                    (safebox_data && safebox_data.get('is_fetching')) 
                    ? <Loading />
                    : null
                }

                {
                    (safebox_data && safebox_data.get('is_fetched') && !safebox_data.get('result') || (safebox && isBoxEmpty(safebox))) 
                    ? <div>
                        <h1 className='h1 text-blue-500 mb-8'>{t('create safebox')}</h1>
                        <CreateSafebox wallet={wallet} />
                    </div>
                    : null 
                }



                {
                    (safebox && !isBoxEmpty(safebox)) 
                    ? <div className=''>
                        <div className='bg-blue-500 text-white p-4 px-6 font-bold rounded-lg flex items-center mb-12'>
                            <div className='mr-2'><LockClosedIcon className='icon-sm text-white'/></div>
                            <div>{t('safebox is created')}</div>
                        </div>
                        {
                            (safebox && isBoxPasswordEmpty(safebox))
                            ? <ResetPassword safebox={safebox} after_success={this.refresh}/>
                            : null
                        }
                        <div>
                            <SafeboxBalance wallet={wallet} />
                        </div>
                    </div>
                    : null
                }


            </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(Safebox);

