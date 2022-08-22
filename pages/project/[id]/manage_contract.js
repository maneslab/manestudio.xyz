import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

// import {confirm} from 'components/common/confirm/index'
import CopyText from 'components/common/copy'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ContractStep from 'components/contract/step'
import Button from 'components/common/button'
import EtherscanLink from 'components/common/etherscan/link';
import Loading from 'components/common/loading'
import Link from 'next/link'

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
import DestroyModal from 'components/contract/destroy_modal'


import {loadContract,saveContract} from 'redux/reducer/contract'
import {updateClub} from 'redux/reducer/club'
// import ContractSide from 'components/contract/side';
import {ethers} from 'ethers'

import manestudio from 'helper/web3/manestudio';
import manenft from 'helper/web3/manenft'
import misc from 'helper/web3/misc'
import config from 'helper/config'

import withClubView from 'hocs/clubview'

import {  InformationCircleIcon,ClipboardIcon,ChevronLeftIcon  } from '@heroicons/react/outline'
// import {strFormat} from 'helper/translate'


import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'
import {percentDecimal,autoDecimal,fromPercentToPPM,hex2Number} from 'helper/number'
import { httpRequest } from 'helper/http';
import { getUnixtime } from 'helper/time';
import { withRouter } from 'next/router';

import {strFormat} from 'helper/translate'

@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
@withRouter
class DeployView extends React.Component {

    constructor(props) {
        super(props)
    
        let env = config.get('ENV');
        let lock_env = 'rinkeby';
        if (env == 'production') {
            lock_env = 'mainnet';
        }

        this.state = {
            contract_data               : {},
            is_fetched_contract_data    : false,
            is_fetching_contract_data   : false,

            lock_env                    : lock_env,
            show_destroy_modal          : false,
            is_destroyed                : false
        }
    }

    componentDidMount() {
        if (this.props.club_id) {
            this.fetchPageData();
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (
            this.props.club_id && this.props.club_id != prevProps.club_id
            || this.props.network && this.props.network != prevProps.network
            || this.props.address && this.props.address != prevProps.address
            ) {
            this.initData();
            this.fetchPageData();
        }
    }

    @autobind
    toggleDestroyModal() {
        this.setState({
            show_destroy_modal : !this.state.show_destroy_modal
        })
    }

    @autobind
    fetchPageData() {
        this.props.loadContract(this.props.club_id);
        this.getContractData();
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
    async getContractData() {

        const {t} = this.props.i18n;
        const {address,network,club_id} = this.props;
            
        this.setState({
            'is_fetching_contract_data' : true,
            'is_fetched_contract_data'  : false
        })

        this.manenft = new manenft(t,network,address);
        let is_destoryed = await this.manenft.isDeployed();

        if (is_destoryed) {
            this.setState({
                'is_fetching_contract_data' : false,
                'is_fetched_contract_data'  : true,
                'is_destroyed'              : true
            });

            this.props.router.push('/project/'+club_id+'/deploy?network='+network);

            return;
        }

        try {


            let contract_data = await this.manenft.contract.getAll();

            console.log('debug0x:contract_data_from_contract',contract_data)

            let contract_data_in_server = await this.fetchContractDataFromServer(address,network);

            console.log('debug0x:contract_data_in_server',contract_data_in_server)

            let miscInstance = new misc();
            let balance = await miscInstance.getBalance(address);
            let paused = await this.manenft.contract.paused();

            let ownerBalance = await this.manenft.contract.ownerBalance();
            let collectorBalance = await this.manenft.contract.collectorBalance();
            let isForceRefundable = await this.manenft.contract.isForceRefundable();
            // console.log('ownerbalance',ownerBalance);


            let presaleMaxMintCountPerAddress = await this.manenft.contract.presaleMaxMintCountPerAddress();
            let saleMaxMintCountPerAddress = await this.manenft.contract.saleMaxMintCountPerAddress();


            let totalAvailableBalance =  ownerBalance.add(collectorBalance);
            // console.log('total_balance',totalAvailableBalance);

            let formated_data = this.deformatContractData(contract_data,contract_data_in_server);

            formated_data['paused'] = (paused == 1) ? true : false;
            formated_data['balance'] = balance;
            formated_data['available_balance'] = ethers.utils.formatEther(totalAvailableBalance.toString());
            formated_data['is_force_refundable'] = (isForceRefundable == 1) ? true : false;
            formated_data['sale_per_wallet_count'] = saleMaxMintCountPerAddress.toString();
            formated_data['presale_per_wallet_count'] = presaleMaxMintCountPerAddress.toString();

            console.log('debug0x:formated_data',formated_data);

            this.setState({
                'contract_data'             : formated_data,
                'is_fetching_contract_data' : false,
                'is_fetched_contract_data'  : true
            })

        }catch(e) {
            console.log('debug03,e',e);
            this.setState({
                'contract_data'             : {},
                'is_fetching_contract_data' : false,
                'is_fetched_contract_data'  : true,
            })


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
            // 'presale_per_wallet_count'  :   contract_data[10].toString(),
            // 'sale_per_wallet_count'     :   contract_data[11].toString(),
        };

        console.log('contract_data_from_contract_formated',contract_data_formatted);

        let share_reserve_data = [];
        if (contract_data2['shares']) {
            contract_data2['shares'].map(one=>{
                share_reserve_data.push({
                    'owner'         : one['address'],
                    'ratioPPM'      : one['ratioPPM'].toString(),
                    // 'collectAmount' : one['collectAmount'].toString(),
                })
            })
        }
        contract_data_formatted['share'] = share_reserve_data;

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
        const {network,address} = this.props;
        let result = await httpRequest({
            'url'   :   '/v1/mane/on_update',
            'data'  : {
                contract_address : address,
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
            case 'rinkeby':
                wish_net_id = 4;
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
        const {t} = this.props.i18n;
        const {club_id,contract,chain,address,network} = this.props;
        let {club} = this.props;
        const {contract_data,is_fetched_contract_data,is_fetching_contract_data} = this.state;

        console.log('debug:is_fetching_contract_data',is_fetching_contract_data)
        console.log('debug:is_fetching_contract_data',is_fetching_contract_data)

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
            is_allow_withdraw = (this.isAllowWithdraw(contract_data['refund']) && !contract_data['is_force_refundable'])
        } 

        if (address) {
            if (network == 'mainnet') {
                club = club.setIn(['is_step_done','step_2'],true);
            }else {
                club = club.setIn(['is_step_done','is_deploy_testnet'],true);
            }
        }

        return <PageWrapper>
            <Head>
                <title>{t('contract')}</title>
            </Head>
            <div>
                <ClubHeader club={club} title={t('smart contract')} active_id={2}  intro={<>
                    <p>{t('Smartcontract-header-intro2')}</p>
                    <p>{t('Smartcontract-header-intro3')}</p>
                </>} />

                <ContractStep club_id={club_id} active_name={'deploy'} contract={contract} next_step={(contract)?true:false} />

                {
                    (is_fetching_contract_data || !is_fetched_contract_data && false)
                    ? <div>
                        <Loading /> 
                    </div>
                    :   <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">

                        <div className="col-span-12 pb-24">

                            <div className='pb-4 mb-4 border-b border-gray-300 dark:border-gray-800 flex justify-between'>
                                <Link href={"/project/"+club_id+"/choose_network"}>
                                <a className='btn btn-primary'>
                                    <ChevronLeftIcon className='icon-sm'/>
                                    {t('back')}
                                </a>
                                </Link>
                                {
                                    (network != 'mainnet' && club && club.getIn(['is_step_done','step_2']) == false)
                                    ?  <Link href={"/project/"+club_id+"/deploy?network=mainnet"}>
                                        <a className='btn btn-secondary'>
                                            {t('deploy on mainnet')}
                                        </a>
                                    </Link>
                                    : null
                                }
                            </div>


                            <h1 className='h1 mb-8'>{
                                (network == 'mainnet')
                                ?   <>{t("manage contract on ETH mainnet")}</>
                                :   <>{strFormat(t("manage contract on {network_name} testnet"),{'network_name':network})}</>
                            }</h1>
                            
                            {
                                (!address)
                                ? <>
                                    {
                                        (!is_network_correct && chain.id)
                                        ? <div className='d-bg-c-1 p-4 pl-6 mb-8 flex justify-between items-center'>
                                            <span className="capitalize">{t('you are connecting to wrong eth network')}</span>
                                            <SwitchChainButton />
                                        </div>
                                        : null
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
                                                                    <div className='flex justify-start items-center'>
                                                                        <EtherscanLink address={address} network={network}/>
                                                                        <CopyText text={address} onSuccessText={t('copy success')}>
                                                                            <ClipboardIcon className="icon-sm ml-2 cursor-pointer" />
                                                                        </CopyText>
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
                                                                    <label>{t('name-2')}</label>
                                                                    <div>
                                                                    {contract_data['name']}
                                                                    </div>
                                                                </div>
                                                                <div className='info-dl w-1/3'>
                                                                    <label>{t('symbol')}</label>
                                                                    <div>
                                                                        {contract_data['symbol']}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <div className='info-dl w-1/3'>
                                                                    <label>{t('collection size')}</label>
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
                                                                    <label>{t('allowlist supply')}</label>
                                                                    <div>
                                                                        {contract_data['presale_max_supply']}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                (contract_data['refund'] && contract_data['refund'].length > 0)
                                                                ? <div className='info-dl'>
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
                                                                : null
                                                            }
                                                            {
                                                                (contract_data['share'] && contract_data['share'].length > 0)
                                                                ? <div className='info-dl'>
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
                                                                : null
                                                            }
                                                            
                                                        </>
                                                        : null
                                                    }

                                                </div>
                                            </div>
                                            <div className="col-span-3 intro">
                                                <p>{t('manage-contract-intro-1')}</p>
                                                <p>{t('manage-contract-intro-2')}</p>
                                                <p>{t('manage-contract-intro-3')}</p>
                                            </div>
                                        </div>
                                    </div>

                                                    
                                    <div className='contract-form'>
                                        <h2 className='mb-2'>{t('withdraw funds')}</h2>
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
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                            <div className='col-span-3 intro'>
                                                <p>{t('Withdraw-intro-1')}</p>
                                                <p>{t('Withdraw-intro-2')}</p>
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
                                                        <span>{t('The following settings in the contract can be updated by paying gas fee')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>

                                            {
                                                (has_presale_stage)
                                                ?   <div className='contract-form'>
                                                    <h2 className='mb-2'>{t('allowlist presale')}</h2>
                                                    <div className='grid grid-cols-9 gap-8'>
                                                        <div className='col-span-6'>
                                                            <div className='ct'>
                                                                <div className='info-dl'>
                                                                    <label>{t('whitelist max supply')}</label>
                                                                    <WlMaxSupplyUpdate value={contract_data['presale_max_supply']} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                </div>
                                                                <div className='info-dl'>
                                                                    <label>{t('whitelist presale time window')}</label>
                                                                    <div className=''>
                                                                        <WlTime value={[contract_data['presale_start_time'],contract_data['presale_end_time']]} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                    </div>
                                                                </div>
                                                                <div className='info-dl'>
                                                                    <label>{t('whitelist token limit per wallet')}</label>
                                                                    <div className=''>
                                                                        <WlLimitPerWallet value={contract_data['presale_per_wallet_count']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-span-3 intro'>
                                                            <p>{t('manage-presale-intro')}</p>
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
                                                                    <label>{t('public sale time window')}</label>
                                                                    <div className=''>
                                                                        <PbTime value={[contract_data['sale_start_time'],contract_data['sale_end_time']]} manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                    </div>
                                                                </div>
                                                                <div className='info-dl'>
                                                                    <label>{t('public sale token limit per wallet')}</label>
                                                                    <div className=''>
                                                                        <PbLimitPerWallet  value={contract_data['sale_per_wallet_count']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                    </div>
                                                                </div>
                                                                <div className='info-dl'>
                                                                    <label>{t('public sale mint price')}</label>
                                                                    <div className=''>
                                                                        <PbPrice value={contract_data['sale_price']}  manenft={this.manenft} onUpdate={this.onUpdate}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-span-3 intro'>
                                                            <p>{t('manage-presale-intro')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                            }

                                            <div className='contract-form'>
                                                <h2 className='mb-2'>{t('panic buttons')}</h2>
                                                <div className='grid grid-cols-9 gap-8'>
                                                    <div className='col-span-6'>
                                                        <div className='ct'>
                                                            <div className='flex justify-between items-center'>
                                                                <div className='text-sm max-w-prose'>
                                                                    {t('emergency-pause-intro')}
                                                                </div>
                                                                {
                                                                    (contract_data['paused'])
                                                                    ? <a className='btn btn-success' onClick={this.paused.bind({},false)}>{t('resume contract')}</a>
                                                                    : <a className='btn btn-error' onClick={this.paused.bind({},true)}>{t('pause contract')}</a>
                                                                }
                                                                
                                                            </div>
                                                            {
                                                                (network != 'mainnet')
                                                                ? <>
                                                                <div className='divider' />
                                                                    <div className='flex justify-between items-center'>
                                                                        <div className='text-sm max-w-prose'>
                                                                            {t('destory-info')}
                                                                        </div>
                                                                        <Button className='btn btn-error' onClick={this.toggleDestroyModal}>{t('destroy contract')}</Button>
                                                                    </div>
                                                                    <DestroyModal is_destroy_contract={this.state.is_destroy_contract} visible={this.state.show_destroy_modal} handleDestroy={this.destroy} closeModal={this.toggleDestroyModal} />
                                                                </>
                                                                : null
                                                            }
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
                                                <span>{t('manage-contract-warning2')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                            
                                    <ContractUpdate contract={contract} club_id={club_id} />
                                </div>
                            }
                        </div>

                        <div className="col-span-4">
                        </div>

                    </div> 
                }

            </div>
    </PageWrapper>
    }
    
}

DeployView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id,
        network : query.network,
        address : query.address
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

