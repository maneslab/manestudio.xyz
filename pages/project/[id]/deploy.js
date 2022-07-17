import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import Button from 'components/common/button'
import GasButton from 'components/common/gas/button'
import Loading from 'components/common/loading'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'
import Showtime from 'components/time/showtime'
import SwitchChainButton from 'components/wallet/switch_chain';
import ContractUpdate from 'components/contract/update'

import WlMaxSupplyUpdate from 'components/contract/update/wl_max_supply';
import WlLimitPerWallet from 'components/contract/update/wl_limit_per_wallet';
import PbLimitPerWallet from 'components/contract/update/pb_limit_per_wallet';
import WlTime from 'components/contract/update/wl_time';
import PbTime from 'components/contract/update/pb_time';
import PbPrice from 'components/contract/update/pb_price';

import {loadContract,saveContract} from 'redux/reducer/contract'
import {updateClub} from 'redux/reducer/club'
import ContractSide from 'components/contract/side';
import {ethers} from 'ethers'

import manestudio from 'helper/web3/manestudio';
import manenft from 'helper/web3/manenft'
import misc from 'helper/web3/misc'
import config from 'helper/config'

import withClubView from 'hocs/clubview'

import {  InformationCircleIcon  } from '@heroicons/react/outline'
import {strFormat, t} from 'helper/translate'

import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'
import {percentDecimal,autoDecimal,fromPercentToPPM,hex2Number} from 'helper/number'
import { httpRequest } from 'helper/http';
import { getUnixtime } from 'helper/time';

@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class DeployView extends React.Component {

    constructor(props) {
        super(props)
    
        let env = config.get('ENV');
        let lock_env = 'kovan';
        if (env == 'production') {
            lock_env = 'mainnet';
        }

        this.state = {
            is_deploy_contract : false,
            is_estimate_ing : false,
            is_estimated    : false,
            gas_data_without_reverse : null,
            gas_data : null,
            reserve_count : 0,

            deploy_contract_address     : '',
            contract_data               : {},
            is_fetched_contract_data    : false,
            is_fetching_contract_data   : false,

            lock_env : lock_env
        }




        const {t} = props.i18n;
        this.mane = new manestudio(t,props.network);
        this.manenft = null;


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
            'is_fetching_contract_data' : false,
            'is_fetched_contract_data'  : false,
        })
        this.props.loadContract(this.props.club_id);
        this.getDeployedAddress();
    }

    @autobind
    initData() {

        const {t} = this.props.i18n;
        const {network} = this.props;

        this.mane = new manestudio(t,network);

        this.setState({
            is_deploy_contract : false,
            is_estimate_ing : false,
            is_estimated    : false,
            gas_data_without_reverse : null,
            gas_data : null,
            reserve_count : 0,

            deploy_contract_address     : '',
            contract_data               : {},
            is_fetched_contract_data    : false,
            is_fetching_contract_data   : false,
        })
    }

    @autobind
    async fetchContractDataFromServer(addr,network) {

        let result = await httpRequest({
            'url'   :   '/v1/mane/get_all',
            'data'  : {
                contract_address : addr,
                network : network
            }
        })

        return result.data;

    }

    @autobind
    async getDeployedAddress() {
        const {t} = this.props.i18n;
        const {club_id,network} = this.props;

        let addr = '0x0';
        try {
            addr = await this.mane.contract.clubMap(club_id);
        }catch(e) {
            console.log('debug-e',e)
        }


        if (hex2Number(addr) != 0) {
            this.setState({
                'deploy_contract_address'   : addr,
            })
        }else {
            this.setState({
                'deploy_contract_address'   : null,
            })
        }

        if (hex2Number(addr) != 0) {
            
            this.setState({
                'is_fetching_contract_data' : true,
                'is_fetched_contract_data'  : false
            })

            try {
                this.manenft = new manenft(t,network,addr);
                let contract_data = await this.manenft.contract.getAll();

                console.log('contract_data_from_contract',contract_data)

                let contract_data_in_server = await this.fetchContractDataFromServer(addr,network);

                let miscInstance = new misc();
                let balance = await miscInstance.getBalance(addr);
                let paused = await this.manenft.contract.paused();

                let ownerBalance = await this.manenft.contract.ownerBalance();
                let collectorBalance = await this.manenft.contract.collectorBalance();
                // console.log('ownerbalance',ownerBalance);

                let totalAvailableBalance =  ownerBalance.add(collectorBalance);
                // console.log('total_balance',totalAvailableBalance);

                let formated_data = this.deformatContractData(contract_data,contract_data_in_server);

                formated_data['paused'] = (paused == 1) ? true : false;
                formated_data['balance'] = balance;
                formated_data['available_balance'] = ethers.utils.formatEther(totalAvailableBalance.toString());

                this.setState({
                    'contract_data' : formated_data,
                    'is_fetching_contract_data' : false,
                    'is_fetched_contract_data'  : true
                })

            }catch(e) {
                this.setState({
                    'deploy_contract_address'   : '',
                    'contract_data'             : {},
                    'is_fetching_contract_data' : false,
                    'is_fetched_contract_data'  : true
                })

            } 


        }

    }

    deformatContractData(contract_data,contract_data2) {

        // console.log('contract_data',contract_data,contract_data2)

        let contract_data_formatted = {
            'reserve_count' : contract_data[0].toString(),
            'max_supply'    : contract_data[1].toString(),
            'presale_max_supply'    : contract_data[2].toString(),
            'club_id'               :   contract_data[3].toString(),
            'presale_start_time'    :   contract_data[4].toString(),
            'presale_end_time'      :   contract_data[5].toString(),
            'sale_start_time'       :   contract_data[6].toString(),
            'sale_end_time'         :   contract_data[7].toString(),
            'presale_price'         :   contract_data[8].toString(),
            'sale_price'            :   ethers.utils.formatEther(contract_data[9].toString()),
            'presale_per_wallet_count'  :   contract_data[10].toString(),
            'sale_per_wallet_count'     :   contract_data[11].toString(),
        };

        console.log('contract_data_from_contract_formated',contract_data_formatted);

        let share_reverse_data = [];
        if (contract_data2['shares']) {
            contract_data2['shares'].map(one=>{
                share_reverse_data.push({
                    'owner'         : one['address'],
                    'ratioPPM'      : one['ratioPPM'].toString(),
                    // 'collectAmount' : one['collectAmount'].toString(),
                })
            })
        }
        contract_data_formatted['share'] = share_reverse_data;

        let refund_time_list = [];
        if (contract_data2['refunds']) {
            contract_data2['refunds'].map(one=>{
                // console.log('refund-one',one)
                refund_time_list.push({
                    'endTime'       :   one['end_time'].toString(),
                    'ratioPPM'      :   one['ratioPPM'].toString(),
                })
            })
        }
        contract_data_formatted['refund'] = refund_time_list;

        let arr_map = ['name','symbol'];
        arr_map.map(one=>{
            if (contract_data2[one]) {
                contract_data_formatted[one] = contract_data2[one];
            }
        });
        

        return contract_data_formatted
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
        let gas_data_without_reverse;

        if (contract.get('reserve_count') > 0) {

            //把预留的count改为0
            data[2][0] = 0;
            gas_data_without_reverse = await this.mane.estimateGasDeploy(...data);

        }

        this.setState({
            is_estimate_ing : false,
            is_estimated : true,
            gas_data_without_reverse : gas_data_without_reverse,
            gas_data : gas_data,
            reserve_count : contract.get('reserve_count')
        })

    }

    @autobind
    async paused(value) {

        const {t} = this.props.i18n;

        let paused = 0;
        if (value) {
            paused = 1;
        }

        var that = this;

        await this.manenft.request({
            'text' : {
                'loading' : (paused) ? t('paused contract') : t('resume contract'),
                'sent'    : (paused) ? t('paused contract tx sent') : t('resume contract tx sent'),
                'success' : (paused) ? t('paused contract successful') : t('resume contract tx successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.manenft.contract.setPaused(paused);
                    console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_paused_contract : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_paused_contract : false,
                    })
                },
                'after_finish_tx' : () => {
                    console.log('after_finish_tx');
                    // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
                    this.fetchPageData();
                }
            } 
        })
    }

    @autobind
    async destroy() {

        const {t} = this.props.i18n;
        const {network} = this.props;
        const {lock_env} = this.state;

        var that = this;

        await this.manenft.request({
            'text' : {
                'loading' : t('destroy contract') ,
                'sent'    : t('destroy contract tx sent'),
                'success' : t('destroy contract tx successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.manenft.contract.destroy();
                    this.onDestroy(tx_in.hash);
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_destroy_contract : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_destroy_contract : false,
                    })
                },
                'after_finish_tx' : () => {
                    // console.log('after_finish_tx');
                    console.log('当前的网络环境是:'+network+',需要解除锁定的网络环境是:'+lock_env);
                    if (network == lock_env) {
                        this.unlockClub();
                    }
                    this.fetchPageData();
                    // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
                }
            } 
        })
    }


    @autobind
    async deploy() {

        const {t} = this.props.i18n;
        const data = await this.getDeployData();
        const {network} = this.props;
        const {lock_env} = this.state;

        var that = this;

        console.log('准备deploy的数据',data);

        await this.mane.request({
            'text' : {
                'loading' : t('deploy contract'),
                'sent'    : t('deploy contract tx sent'),
                'success' : t('deploy contract successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.mane.contract.deploy(...data);
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
                    }
                    this.fetchPageData();
                    ///刷新数据
                }
            } 
        })
    }
    @autobind
    async withdraw() {
        const {t} = this.props.i18n;
        var that = this;

        await this.mane.request({
            'text' : {
                'loading' : t('withdraw'),
                'sent'    : t('withdraw tx sent'),
                'success' : t('withdraw successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.manenft.contract.collect();
                    console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_withdrawing : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_withdrawing : false,
                    })
                },
                'after_finish_tx' : () => {
                    console.log('after_finish_tx');
                    // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
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

    isNetworkCurrect(network,chain) {
        let wish_net_id = 0;
        switch(network) {
            case 'mainnet':
                wish_net_id = 1;
                break;
            case 'ropsten':
                wish_net_id = 3;
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

    isAllowWithdraw(refund_list) {
        if (!refund_list) {
            return true;
        }
        let now_unixtime = getUnixtime();
        let allow_withdraw = true;
        refund_list.map((item,index) => {
            if (now_unixtime < item.endTime) {
                allow_withdraw = false;
            }
        })
        return allow_withdraw;
    }

    render() {
        // const {t} = this.props.i18n;
        const {club_id,contract,chain,eth_price,network} = this.props;
        const {deploy_contract_address,contract_data,is_fetched_contract_data,is_fetching_contract_data} = this.state;

        console.log('debug:contract_data',contract_data)
        console.log('debug:chain',chain)

        let has_presale_stage = false;
        if (is_fetched_contract_data) {
            if (contract_data['presale_start_time'] > 0 && contract_data['presale_end_time'] > 1) {
                has_presale_stage = true;
            }
        }

        let has_public_sale_stage = false;
        if (is_fetched_contract_data) {
            if (contract_data['sale_start_time'] > 0) {
                has_public_sale_stage = true;
            }
        }

        let is_network_correct = this.isNetworkCurrect(network,chain);

        let is_allow_withdraw = false;
        if (contract_data) {
            is_allow_withdraw = this.isAllowWithdraw(contract_data['refund'])
        } 


        
/*                        <div>
                            <button className='btn btn-default' onClick={this.lockClub}>lockClub</button>
                            <button className='btn btn-default' onClick={this.unlockClub}>unlockClub</button>
                        </div>*/

        return <PageWrapper>
            <Head>
                <title>{t('contract')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={'smart contract'} active_id={2}/>

                <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">

                    <div className="col-span-2">
                        <ContractSide club_id={club_id}/>
                    </div>


                    <div className="col-span-10 pb-24">

                        <h1 className='h1 mb-8'>{(network == 'mainnet')?t('deployment to ETH mainnet'):t('deployment to ETH testnet') + ' : ' + network}</h1>
                        
                        {
                            (!deploy_contract_address)
                            ? <>
                                {
                                    (!is_network_correct && chain.id)
                                    ? <div className='d-bg-c-1 p-4 pl-8 mb-8 flex justify-between items-center'>
                                        <span className="capitalize">{t('you are connecting to wrong eth network')}</span>
                                        <SwitchChainButton />
                                    </div>
                                    : <div className='d-bg-c-1 p-4 pl-8 mb-8 '>
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
                                                <Button loading={this.state.is_deploy_contract} className='btn btn-primary' onClick={this.deploy}>deploy</Button>
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
                                                                <td>{t('contract deploy without reverse')}</td>
                                                                <td>{autoDecimal(this.state.gas_data_without_reverse.gasFee.toString())} ETH</td>
                                                                {
                                                                    eth_price 
                                                                    ? <td>{autoDecimal(Number(this.state.gas_data_without_reverse.gasFee.toString()* eth_price))} USD</td>
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
                            </>
                            : <div>
                                <div className='contract-form'>
                                    <h2 className='mb-2'>{t('contract infomation')}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>
                                                {
                                                    (is_fetching_contract_data)
                                                    ? <div className='py-12'><Loading /></div>
                                                    : null
                                                }
                                                {
                                                    (is_fetched_contract_data)
                                                    ? <>
                                                        <div className='flex justify-between'>
                                                            <div className='info-dl'>
                                                                <label>{t('contract address')}</label>
                                                                <div>
                                                                {deploy_contract_address}
                                                                </div>
                                                            </div>
                                                            <div className='info-dl'>
                                                                <label>{t('status')}</label>
                                                                <div>
                                                                {contract_data['paused'] ? <span className='text-red-500 uppercase'>{t('paused')}</span> : <span className='text-green-500 uppercase'>{t('live')}</span>}
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        
                                                        <div className='flex justify-between'>
                                                            <div className='info-dl w-1/3'>
                                                                <label>Type</label>
                                                                <div>
                                                                    ERC721
                                                                </div>
                                                            </div>
                                                            <div className='info-dl w-1/3'>
                                                                <label>Name</label>
                                                                <div>
                                                                {contract_data['name']}
                                                                </div>
                                                            </div>
                                                            <div className='info-dl w-1/3'>
                                                                <label>Symbol</label>
                                                                <div>
                                                                    {contract_data['symbol']}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <div className='info-dl w-1/3'>
                                                                <label>collection size</label>
                                                                <div>
                                                                    {contract_data['max_supply']}
                                                                </div>
                                                            </div>
                                                            <div className='info-dl w-1/3'>
                                                                <label>{t('reserve count')}</label>
                                                                <div>
                                                                    {contract_data['reserve_count']}
                                                                </div>
                                                            </div>
                                                            <div className='info-dl w-1/3'>
                                                                <label>{t('whitelist supply')}</label>
                                                                <div>
                                                                    {contract_data['presale_max_supply']}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='info-dl'>
                                                            <label className="capitalize">{t('refundable')}</label>
                                                            <div className='py-2'>
                                                                <table className='info-table w-full"'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>{t('time')}</th>
                                                                            <th className='w-1/3'>{t('refundable ratio')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            (contract_data['refund'].map(one=>{
                                                                                return <tr key={one.endTime}>
                                                                                    <td><span className=''><Showtime unixtime={one.endTime} /></span></td>
                                                                                    <td>{percentDecimal(one.ratioPPM/1000000)}%</td>
                                                                                </tr>
                                                                            }))
                                                                        }
                                                                        
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className='info-dl'>
                                                            <label className="capitalize">{t('revenue sharing')}</label>
                                                            <div className='py-2'>
                                                                <table className='info-table w-full"'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>{t('address')}</th>
                                                                            <th className='w-1/3'>{t('share ratio')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            (contract_data['share'].map(one=>{
                                                                                return <tr key={one.owner}>
                                                                                    <td><span className=''>{one.owner}</span></td>
                                                                                    <td>{percentDecimal(one.ratioPPM/1000000)}%</td>
                                                                                </tr>
                                                                            }))
                                                                        }
                                                                        
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                                }

                                            </div>
                                        </div>
                                        <div className="col-span-3 intro">
                                            <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                            <p>{t('You can define your details of your contract here, as well as many customizable function below.')}</p>
                                            <p>{t('DON’T PANIC! You can deploy your contract to Kovan testnet for free, check if everythings is correct, then deploy to Ethereum mainnet.')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='contract-form'>
                                    <h2 className='mb-2'>{t('withdraw')}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>
                                                <div className='flex justify-start items-center w-full'>
                                                    <div className='info-dl end w-1/3'>
                                                        <label>{t('total balance')}</label>
                                                        <div>
                                                            {contract_data['balance']} ETH
                                                        </div>
                                                    </div>
                                                    <div className='info-dl end w-1/3'>
                                                        <label>{t('available balance')}</label>
                                                        <div>
                                                            {contract_data['available_balance']} ETH
                                                        </div>
                                                    </div>
                                                    <div className='w-1/3 flex justify-end'>
                                                        {
                                                            (is_allow_withdraw)
                                                            ? <button className='btn btn-default' onClick={this.withdraw}>{t('withdraw')}</button>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    (!is_allow_withdraw)
                                                    ? <div className='border-t d-border-c-1 pt-4 mt-4'>
                                                        {t('withdrawals can only be made after all refund periods have expired and at least 7 days after mint.')}
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    (is_fetched_contract_data)
                                    ? <>
                                        <div className='grid grid-cols-9 gap-8'>
                                        <div className='col-span-6'>
                                            <div class="alert alert-info shadow-sm mb-8">
                                                <div>
                                                    <InformationCircleIcon className='icon-sm'/>
                                                    <span>{t('the following settings need to be modified in the contract by paying GAS')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        {
                                            (has_presale_stage)
                                            ?   <div className='contract-form'>
                                                <h2 className='mb-2'>{t('whitelist')}</h2>
                                                <div className='grid grid-cols-9 gap-8'>
                                                    <div className='col-span-6'>
                                                        <div className='ct'>
                                                            <div className='info-dl'>
                                                                <label>{t('whitelist max supply')}</label>
                                                                <WlMaxSupplyUpdate value={contract_data['presale_max_supply']} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                            </div>
                                                            <div className='info-dl'>
                                                                <label>{t('whitelist mint time')}</label>
                                                                <div className=''>
                                                                    <WlTime value={[contract_data['presale_start_time'],contract_data['presale_end_time']]} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                            </div>
                                                            <div className='info-dl'>
                                                                <label>{t('mint limit per wallet')}</label>
                                                                <div className=''>
                                                                    <WlLimitPerWallet value={contract_data['presale_per_wallet_count']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-span-3'>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                        }

                                        {
                                            (has_public_sale_stage)
                                            ? <div className='contract-form'>
                                                <h2 className='mb-2'>{t('public sale')}</h2>
                                                <div className='grid grid-cols-9 gap-8'>
                                                    <div className='col-span-6'>
                                                        <div className='ct'>
                                                            <div className='info-dl'>
                                                                <label>{t('public sale mint time')}</label>
                                                                <div className=''>
                                                                    <PbTime value={[contract_data['sale_start_time'],contract_data['sale_end_time']]} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                            </div>
                                                            <div className='info-dl'>
                                                                <label>{t('mint limit per wallet')}</label>
                                                                <div className=''>
                                                                    <PbLimitPerWallet  value={contract_data['sale_per_wallet_count']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                            </div>
                                                            <div className='info-dl'>
                                                                <label>{t('mint price')}</label>
                                                                <div className=''>
                                                                    <PbPrice value={contract_data['sale_price']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-span-3'>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                        }

                                        <div className='contract-form'>
                                            <h2 className='mb-2'>{t('special tools')}</h2>
                                            <div className='grid grid-cols-9 gap-8'>
                                                <div className='col-span-6'>
                                                    <div className='ct'>
                                                        <div className='flex justify-between items-center'>
                                                            <div className='text-sm'>
                                                                {t('Emergency suspension will suspend Mint for the entire contract, which is used to suspend Mint in an emergency')}
                                                            </div>
                                                            {
                                                                (contract_data['paused'])
                                                                ? <a className='btn btn-success' onClick={this.paused.bind({},false)}>{t('resume')}</a>
                                                                : <a className='btn btn-error' onClick={this.paused.bind({},true)}>{t('pause')}</a>
                                                            }
                                                            
                                                        </div>
                                                        <div className='divider' />
                                                        <div className='flex justify-between items-center'>
                                                            <div className='text-sm'>
                                                                {t('If you are not satisfied with some configuration, such as account splitting, refund, name, etc., you can destroy the contract and republish it')}
                                                            </div>
                                                            <Button loading={this.state.is_destroy_contract} className='btn btn-error' onClick={this.destroy}>{t('destroy')}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-span-3'>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    : null
                                }
                                <div className='grid grid-cols-9 gap-8'>
                                <div className='col-span-6'>
                                    <div class="alert alert-info shadow-sm mb-8">
                                        <div>
                                            <InformationCircleIcon className='icon-sm'/>
                                            <span>{t('the following settings, which do not require contract modification, will take effect in real time')}</span>
                                        </div>
                                    </div>
                                </div>
                                </div>
                        
                                <ContractUpdate contract={contract} club_id={club_id} />
                            </div>
                        }
                    </div>
                </div> 
            </div>
    </PageWrapper>
    }
    
}

DeployView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id,
        network : query.net
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

