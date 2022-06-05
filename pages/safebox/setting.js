import React from 'react';

import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import PageWrapper from 'components/pagewrapper'

import Loading from 'components/common/loading'

import MustConnectWallet from 'components/must_connect'
import CreateSafebox from 'components/safebox/create'

import {loadSafebox} from 'redux/reducer/safebox'
import Head from 'next/head'
import message from 'components/common/message'
import notification from 'components/common/notification'

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';

import {generateProof,getBoxhash} from 'helper/zkpay';
import {getConfig} from 'helper/config'
import Erc20  from 'helper/web3/erc20';


import SetSocialRecover from 'components/safebox/socail_recover_create'
import SocialRecover from 'components/safebox/socail_recover'

import withWallet from 'hocs/wallet';
import { denormalize } from 'normalizr';
import {safeboxSchema} from 'redux/schema/index'
import {isBoxEmpty} from 'helper/zkpay'


@withTranslate
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




    render() {
        const {t} = this.props.i18n;
        // const {safebox_hash,is_adding_safebox,balance_map,is_fetching_balance} = this.state;
        const {safebox_data_all,entities,wallet} = this.props;

        
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

                <div className=''>
                    <h1 className='h1 text-blue-500 mb-8'>{t('setting')}</h1>
                    {
                        (safebox && !isBoxEmpty(safebox)) 
                        ? <div className='bg-white rounded-lg p-4 shadow mb-8'>
                                <h2 className='h2'>{t('set up social recovery')}</h2>
                                <div className='border-b border-gray-200 my-4'></div>
                                <div>
                                    <SetSocialRecover wallet={wallet} safebox={safebox}/>
                                </div>
                        </div>
                        : null
                    }
                     <div className='bg-white rounded-lg p-4 shadow'>
                            <h2 className='h2'>{t('helping others with social recovery')}</h2>
                            <div className='border-b border-gray-200 my-4'></div>
                            <div>
                                <SocialRecover wallet={wallet}/>
                            </div>
                    </div>
                    
                </div>


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

