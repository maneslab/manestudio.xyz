import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import {confirm} from 'components/common/confirm/index'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ContractStep from 'components/contract/step'
import Button from 'components/common/button'
import GasButton from 'components/common/gas/button'
import Loading from 'components/common/loading'
import Link from 'next/link'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'
import SwitchChainButton from 'components/wallet/switch_chain';

import {loadContract,saveContract} from 'redux/reducer/contract'
import {updateClub} from 'redux/reducer/club'
import {ethers} from 'ethers'

import manestudio from 'helper/web3/manestudio';
import config from 'helper/config'

import withClubView from 'hocs/clubview'
import SuccessModal from 'components/common/success_modal'

import {  ExternalLinkIcon,ChevronLeftIcon  } from '@heroicons/react/outline'


import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'
import {autoDecimal,fromPercentToPPM,hex2Number} from 'helper/number'
import { httpRequest } from 'helper/http';
import { withRouter } from 'next/router';

@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
@withRouter
class DeployView extends React.Component {

    constructor(props) {
        super(props)
    
        let lock_env = config.get('ETH_NETWORK');

        this.state = {

            is_deploy_contract : false,
            is_estimate_ing : false,
            is_estimated    : false,
            gas_data_without_reserve : null,
            gas_data : null,
            reserve_count : 0,

            deploy_contract_address     : '',
            is_fetched                  : false,
            is_fetching                 : false,

            lock_env                    : lock_env,
        }
    }

    componentDidMount() {
        if (this.props.club_id) {
            this.fetchPageData();
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.fetchPageData();
        }
        if (this.props.network && this.props.network != prevProps.network) {
            this.initData();
            this.fetchPageData();
        }
    }


    @autobind
    fetchPageData() {
        this.setState({
            'is_fetching' : false,
            'is_fetched'  : false,
        })
        this.props.loadContract(this.props.club_id);
        this.getDeployedAddress();
    }

    @autobind
    initData() {
        this.setState({
            is_deploy_contract : false,
            is_estimate_ing : false,
            is_estimated    : false,
            gas_data_without_reserve : null,
            gas_data : null,
            reserve_count : 0,

            deploy_contract_address     : '',
            contract_data               : {},
            is_fetched_contract_data    : false,
            is_fetching_contract_data   : false,
            show_success_modal          : false
        })
    }

    @autobind
    toggleSuccessModal() {
        this.setState({
            show_success_modal : !this.state.show_success_modal
        })
    }

    @autobind
    async getDeployedAddress() {
        const {t} = this.props.i18n;
        const {club_id,network} = this.props;

        let mane = new manestudio(t,network);

        let addr = '0x0';
        try {
            addr = await mane.contract.clubMap(club_id);
        }catch(e) {
            console.log('debug-e',e)
        }

        if (hex2Number(addr) != 0) {
            this.setState({
                'deploy_contract_address'   : addr,
                'is_fetching'               : false,
                'is_fetched'                : true
            })
            return addr;
        }else {
            this.setState({
                'deploy_contract_address'   : null,
                'is_fetching'               : false,
                'is_fetched'                : true
            })

            return null;
        }
    }

    /*
    *   获得deploy合约时候服务端的签名
    */
    @autobind
    async getSign() {

        let result = await httpRequest({
            'url'   :   '/v1/club/get_deploy_sign',
            'data'  : {
                id : this.props.club_id
            }
        })

        result.data.sign.r  = '0x'+result.data.sign.r
        result.data.sign.s  = '0x'+result.data.sign.s

        return result.data;
    }

    @autobind
    async getDeployData() {

        ///准备deploy的资料
        let {contract,club} = this.props;

        let u256s = {
            "reserve_count" : contract.get('reserve_count'),
            "max_supply"    : contract.get('max_supply'),
            "presale_max_supply"    :   contract.get('wl_enable') ? contract.get('wl_max_supply') : 0,
            "club_id"       : contract.get('club_id'),
            'presale_start_time'    :   (contract.get('wl_enable') && contract.get('wl_start_time')) ? contract.get('wl_start_time') : 0,
            'presale_end_time'      :   (contract.get('wl_enable') && contract.get('wl_end_time')) ? contract.get('wl_end_time') : 1,
            'sale_start_time'       :   (contract.get('pb_enable') && contract.get('pb_start_time')) ? contract.get('pb_start_time') : 0,
            'sale_end_time'         :   (contract.get('pb_enable') && contract.get('sale_end_time')) ? contract.get('sale_end_time') : 0,
            'presale_price'         :   contract.get('wl_enable') ? ethers.utils.parseEther(contract.get('wl_price')) : 0,
            'sale_price'            :   contract.get('pb_enable') ? ethers.utils.parseEther(contract.get('pb_price')) : 0,
            'presale_per_wallet_count'  :   contract.get('wl_enable') ? contract.get('wl_per_address') : 0,
            'sale_per_wallet_count'  :   contract.get('pb_enable') ? contract.get('pb_per_address') : 0,
        }

        // console.log('debug05,u256s',u256s);

        let share_address_list = [];
        let share_ratio_list = [];
        if (contract.get('revenue_share_enable')) {
            contract.get('revenue_share').map(one=>{
                share_address_list.push(one.get('address'));
                share_ratio_list.push(fromPercentToPPM(one.get('rate')));
            })
        }

        let refund_time_list = [];
        let refund_ratio_list = [];
        if (contract.get('refund_enable')) {
            contract.get('refund').map(one=>{
                refund_time_list.push(one.get('end_time'));
                refund_ratio_list.push(fromPercentToPPM(one.get('refund_rate')));
            })
        }
        
        let data = {
            'name'      : contract.get('name'),
            'symbol'    : contract.get('symbol'),
            'refund_time_list' : refund_time_list,
            'refund_ratio_list': refund_ratio_list,
            'share_address_list' : share_address_list,
            'share_ratio_list'   : share_ratio_list,
            'u256s'              : u256s
        };

        let sign = await this.getSign();

        return [
            data.name,
            data.symbol,
            [
                data.u256s.reserve_count,
                data.u256s.max_supply,
                data.u256s.presale_max_supply,
                data.u256s.club_id,
                data.u256s.presale_start_time,
                data.u256s.presale_end_time,
                data.u256s.sale_start_time,
                data.u256s.sale_end_time,
                data.u256s.presale_price,
                data.u256s.sale_price,
                data.u256s.presale_per_wallet_count,
                data.u256s.sale_per_wallet_count,
                sign.nonce,
            ],
            data.share_address_list,
            data.share_ratio_list,
            data.refund_time_list,
            data.refund_ratio_list,
            sign.sign.v,
            sign.sign.r,
            sign.sign.s
        ];
    }

    @autobind
    async estimateGas() {
        const data = await this.getDeployData();
        const {contract} = this.props;

        this.setState({
            is_estimate_ing : true
        })

        ///预估gas费用
        let gas_data = await this.mane.estimateGasDeploy(...data);
        let gas_data_without_reserve;

        if (contract.get('reserve_count') > 0) {

            //把预留的count改为0
            data[2][0] = 0;
            gas_data_without_reserve = await this.mane.estimateGasDeploy(...data);

        }

        this.setState({
            is_estimate_ing : false,
            is_estimated : true,
            gas_data_without_reserve : gas_data_without_reserve,
            gas_data : gas_data,
            reserve_count : contract.get('reserve_count')
        })

    }

    @autobind
    async redirectToNewContract() {
        let addr = await this.getDeployedAddress();
        const {club_id,network} = this.props;

        this.props.router.push(`/project/${club_id}/manage_contract/?network=${network}&address=${addr}`);
    }

    @autobind
    async deploy() {

        const {t} = this.props.i18n;
        const data = await this.getDeployData();
        const {network} = this.props;
        const {lock_env} = this.state;

        var that = this;

        console.log('准备deploy的数据',data);
        let mane = new manestudio(t,network);

        await mane.request({
            'text' : {
                'loading' : t('deploy contract'),
                'sent'    : t('deploy contract tx sent'),
                'success' : t('deploy contract successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await mane.contract.deploy(...data);
                    // console.log('tx is send',tx_in)
                    this.onDeploy(tx_in.hash);
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_deploy_contract : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_deploy_contract : false,
                    })
                },
                'after_finish_tx' : () => {
                    // console.log('after_finish_tx');
                    //如果是正式环境发布以后需要lock这个club
                    console.log('当前的网络环境是:'+network+',需要锁定的网络环境是:'+lock_env);
                    if (network == lock_env) {
                        this.lockClub();
                        this.toggleSuccessModal();
                    }else {
                        //跳转到新的合约地址
                        this.redirectToNewContract();
                    }
                }
            } 
        })
    }

    @autobind
    async onDeploy(tx_hash) {
        const {network,club_id} = this.props;
        let result = await httpRequest({
            'url'   :   '/v1/mane/on_deploy',
            'data'  : {
                tx_hash : tx_hash,
                network : network,
                club_id : club_id
            },
            'method': 'POST'
        })
        return result
    }

    @autobind
    async onDestroy(tx_hash) {
        const {network,club_id} = this.props;
        let result = await httpRequest({
            'url'   :   '/v1/mane/on_destroy',
            'data'  : {
                tx_hash : tx_hash,
                network : network,
                club_id : club_id
            },
            'method': 'POST'
        })
        return result
    }

    @autobind
    async onUpdate(tx_hash) {
        const {network} = this.props;
        const {deploy_contract_address} = this.state;
        let result = await httpRequest({
            'url'   :   '/v1/mane/on_update',
            'data'  : {
                contract_address : deploy_contract_address,
                network : network,
                tx_hash : tx_hash
            },
            'method': 'POST'
        })
        return result
    }

    @autobind
    lockClub() {
        const {club_id} = this.props;
        this.props.updateClub(club_id,{'is_lock':1});
    }

    @autobind
    unlockClub() {
        const {club_id} = this.props;
        this.props.updateClub(club_id,{'is_lock':0});
    }

    @autobind
    async deployWithWarning(e) {
        const {t} = this.props.i18n;
        if (await confirm({
            title : t('deploy contract warning'),
            confirmation: <div>
                <div>{t('After deployment, the project will be locked, you can no longer add, delete NFTtrait, images, can not modify the contract settings, etc.')}</div>
            </div>
        })) {
            e.stopPropagation();
            this.deploy();
        }
    }

    isNetworkCurrect(network,chain) {
        let wish_net_id = 0;

        switch(network) {
            case 'mainnet':
                wish_net_id = 1;
                break;
            case 'rinkeby':
                wish_net_id = 4;
                break;
            case 'kovan':
                wish_net_id = 42;
                break;
            default:
                wish_net_id = 1;
                break;
        }

        if (chain && chain.id == wish_net_id) {
            return true;
        }else {
            return false;
        }
    }


    render() {
        const {t} = this.props.i18n;
        const {club_id,club,contract,chain,eth_price,network} = this.props;
        const {is_fetched_contract_data,is_fetching_contract_data} = this.state;

        let is_network_correct = this.isNetworkCurrect(network,chain);
        

        return <PageWrapper>
            <Head>
                <title>{t('contract')}</title>
            </Head>
            <div>
                <ClubHeader club={club} title={t('smart contract')} active_id={2} intro={null} />

                <ContractStep club_id={club_id} active_name={'deploy'} contract={contract} next_step={(contract)?true:false} />

                {
                    (is_fetching_contract_data || !is_fetched_contract_data && false)
                    ? <div>
                        <Loading /> 
                    </div>
                    :   <div className="max-w-screen-sm mx-auto pb-32">

                        <div className="">

                            <div className='pb-4 mb-4 border-b border-gray-300 dark:border-gray-800'>
                                <Link href={"/project/"+club_id+"/choose_network"}>
                                <a className='btn btn-primary'>
                                    <ChevronLeftIcon className='icon-sm'/>
                                    {t('back')}
                                </a>
                                </Link>
                            </div>


                            <h1 className='h1 mb-8'>{
                                (network == 'mainnet')
                                ?   <>{t("deploy to ETH mainnet")}</>
                                :   <>{t("deploy to ETH testnet") + " : " + network}</>
                            }</h1>
                            
                            {
                                (!is_network_correct && chain.id)
                                ? <div className='d-bg-c-1 p-4 pl-6 mb-8 flex justify-between items-center'>
                                    <span className="capitalize">{t('you are connecting to wrong eth network')}</span>
                                    <SwitchChainButton />
                                </div>
                                : <div className='d-bg-c-1 p-4 pl-6 mb-8 '>
                                    <div className='flex justify-between items-center'>
                                        <span className="capitalize">{t('you are connecting to the ETH testnet')} {chain.name}</span>
                                        <div className='flex justify-end items-center'>
                                            {
                                                (network == 'mainnet')
                                                ? <>
                                                    <GasButton />
                                                    <Button loading={this.state.is_estimate_ing} className='btn btn-default mr-2' onClick={this.estimateGas}>estimate gas fee</Button>
                                                </>
                                                : null
                                            }
                                            <Button loading={this.state.is_deploy_contract} className='btn btn-primary' onClick={(network=='mainnet')?this.deployWithWarning:this.deploy}>deploy</Button>
                                        </div>
                                    </div>
                                    {
                                        (this.state.is_estimated)
                                        ? <div className='pt-4 mt-4 border-t d-border-c-1'>
                                            <h3 className='text-gray-500 mb-2'>{t('gas estimate')}</h3>
                                            <table className='info-table w-full"'>
                                                <thead>
                                                    <tr>
                                                        <th>{t('type')}</th>
                                                        <th>{t('estimate gas')}</th>
                                                        {
                                                            (eth_price)
                                                            ? <th>{t('usd value')}</th>
                                                            : null
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{t('contract deploy')}</td>
                                                        <td>{autoDecimal(this.state.gas_data.gasFee.toString())} ETH</td>
                                                        {
                                                            eth_price 
                                                            ? <td>{autoDecimal(Number(this.state.gas_data.gasFee.toString()* eth_price))} USD</td>
                                                            : null
                                                        }
                                                    </tr>
                                                    {
                                                        (this.state.reserve_count > 0)
                                                        ? <tr>
                                                            <td>{t('contract deploy without reserve')}</td>
                                                            <td>{autoDecimal(this.state.gas_data_without_reserve.gasFee.toString())} ETH</td>
                                                            {
                                                                eth_price 
                                                                ? <td>{autoDecimal(Number(this.state.gas_data_without_reserve.gasFee.toString()* eth_price))} USD</td>
                                                                : null
                                                            }
                                                        </tr>
                                                        : null
                                                    }
                                                </tbody>
                                            </table>
                                        

                                            
                                        </div>
                                        : null
                                    }
                                </div>
                            }

                            <div>
                                {
                                    (network == 'rinkeby')
                                    ? <div className='d-bg-c-1 p-4 pl-6'>
                                        <h2 className='font-bold capitalize border-b pb-4 mb-4 d-border-c-1'>Rinkeby Testnet Faucet</h2>
                                        <div className='flex justify-between items-center'>
                                            <div className="capitalize">{t('get Rinkeby Testnet ETH')}</div>
                                            <a href="https://faucets.chain.link/rinkeby" target="_blank" className='btn btn-default'>
                                                <ExternalLinkIcon className='icon-sm mr-2' />{t('Get')}
                                            </a>
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
                             
                        </div>

                    </div> 
                }

                <SuccessModal 
                    visible={this.state.show_success_modal} 
                    closeModal={this.toggleSuccessModal} 
                    title={t('Congratulations!')} 
                    desc={t('contract-success-desc')} 
                    link_text={t('go to minting page')} 
                    link_href={'/project/'+club_id+'/drop'} />

            </div>
    </PageWrapper>
    }
    
}

DeployView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id,
        network : query.network
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        loadContract : (club_id) => {
            return dispatch(loadContract(club_id))
        },
        saveContract : (data) => {
            return dispatch(saveContract(data))
        },
        updateClub : (club_id,data) => {
            return dispatch(updateClub(club_id,data))
        }
    }
}
function mapStateToProps(state,ownProps) {

    let contract_load_data = state.getIn(['contract','load',ownProps.club_id]);
    let contract_id = null
    let contract = null;
    if (contract_load_data && contract_load_data.get('contract_id')) {
        contract_id = contract_load_data.get('contract_id')
        contract = denormalize(contract_id,contractSchema,state.get('entities'));
    }

    return {
        'contract' : contract,
        'contract_id' : contract_id,
        'eth_price'   : state.getIn(['setting','eth_price']),
        'is_fetching' : (contract_load_data) ? contract_load_data.get('is_fetching') : false,
    }
}

export default withTranslate(connect(mapStateToProps,mapDispatchToProps)(DeployView))

