import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import Button from 'components/common/button'
import GasButton from 'components/common/gas/button'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'
import Showtime from 'components/time/showtime'
import SwitchChainButton from 'components/wallet/switch_chain';
import ContractUpdate from 'components/contract/update'

import {loadContract,saveContract} from 'redux/reducer/contract'
import ContractSide from 'components/contract/side';
import {ethers} from 'ethers'
import notification from 'components/common/notification'

import manestudio from 'helper/web3/manestudio';

import withClubView from 'hocs/clubview'

import {  InformationCircleIcon,  } from '@heroicons/react/outline'
import {t} from 'helper/translate'

import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'
import withWallet from 'hocs/wallet';
import {percentDecimal,autoDecimal,fromPercentToPPM} from 'helper/number'

@withTranslate
@withWallet
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class ContractView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_deploy_contract : false,
            is_estimate_ing : false,
            is_estimated    : false,
            gas_data_without_reverse : null,
            gas_data : null,
            reserve_count : 0
        }
    }

    componentDidMount() {
        if (this.props.club_id) {
            this.props.loadContract(this.props.club_id);
        }
        // 
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.props.loadContract(this.props.club_id);
        }
    }

    // componentWillUnmount() {
    //     if (this.timer) {
    //         clearTimeout(this.timer);
    //     }
    // }

    // @autobind
    // toggleModal(name) {
    //     this.setState({
    //         [name]: !this.state[name]
    //     })
    // }

    @autobind
    getDeployData() {

        ///准备deploy的资料
        let {contract,club} = this.props;
        // console.log('debug05:contract',contract.toJS())
        // console.log('debug05:club',club.toJS())


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

        return data;
    }

    @autobind
    async estimateGas() {
        const data = this.getDeployData();
        let mane = new manestudio(t,'kovan');

        
        this.setState({
            is_estimate_ing : true
        })

        ///预估gas费用
        let gas_data = await mane.estimateGasDeploy(
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
                data.u256s.sale_per_wallet_count
            ],
            data.share_address_list,
            data.share_ratio_list,
            data.refund_time_list,
            data.refund_ratio_list,
        );

        let gas_data_without_reverse;

        if (data.u256s.reserve_count > 0) {

            gas_data_without_reverse = await mane.estimateGasDeploy(
                data.name,
                data.symbol,
                [
                    0,
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
                    data.u256s.sale_per_wallet_count
                ],
                data.share_address_list,
                data.share_ratio_list,
                data.refund_time_list,
                data.refund_ratio_list,
            );

        }

        this.setState({
            is_estimate_ing : false,
            is_estimated : true,
            gas_data_without_reverse : gas_data_without_reverse,
            gas_data : gas_data,
            reserve_count : data.u256s.reserve_count
        })
        // console.log('estimateGasDepositToken得到的gas_data：',gas_data);
        // console.log('estimateGasDepositToken得到的gas_fee：',gas_data.gasFee.toString());
        // notification.info({
        //     'message' : '预估Gas费用',
        //     'description': '预计需要的GAS费用是:'+autoDecimal(gas_data.gasFee.toString())+'ETH'
        // });

    }

    @autobind
    async deploy() {

        const {t} = this.props.i18n;

        const data = this.getDeployData();

        let mane = new manestudio(t,'kovan');
        console.log('mane',mane)



        var that = this;

        await mane.request({
            'text' : {
                'loading' : t('deploy contract'),
                'sent'    : t('deploy contract tx sent'),
                'success' : t('deploy contract successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await mane.contract.deploy(
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
                            data.u256s.sale_per_wallet_count
                        ],
                        data.share_address_list,
                        data.share_ratio_list,
                        data.refund_time_list,
                        data.refund_ratio_list
                    );
                    console.log('tx is send',tx_in)
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
                    console.log('after_finish_tx');
                    // this.getUserSafeBox(this.props.login_user.get('wallet_address'));
                }
            } 
        })
    }

    render() {
        // const {t} = this.props.i18n;
        const {club_id,contract,wallet,chain,chains} = this.props;

        console.log('wallet-test',wallet,chain,chains)

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

                        <h1 className='h1 mb-8'>{t('deployment to ETH testnet')}</h1>

                        {
                            (chain && chain.id == 1)
                            ? <div className='d-bg-c-1 p-4 pl-8 mb-8 flex justify-between items-center'>
                                <span className="capitalize">{t('you are connecting to the ETH mainnet')}</span>
                                <SwitchChainButton />
                            </div>
                            : <div className='d-bg-c-1 p-4 pl-8 mb-8 '>
                                <div className='flex justify-between items-center'>
                                    <span className="capitalize">{t('you are connecting to the ETH testnet')} {chain.name}</span>
                                    <div className='flex justify-end items-center'>
                                        <GasButton />
                                        <Button loading={this.state.is_estimate_ing} className='btn btn-default mr-2' onClick={this.estimateGas}>estimate gas fee</Button>
                                        <Button loading={this.state.is_deploy_contract} className='btn btn-primary' onClick={this.deploy}>deploy</Button>
                                    </div>
                                </div>
                                {
                                    (this.state.is_estimated)
                                    ? <div className='pt-4 mt-4 border-t border-gray-100'>
                                        <h3 className='text-gray-500 mb-2'>{t('gas estimate')}</h3>
                                        <div className='flex justify-start'>
                                            <span className='w-64'>{t('contract deploy')}</span>
                                            <span>{autoDecimal(this.state.gas_data.gasFee.toString())} ETH</span>
                                        </div>
                                        {
                                            (this.state.reserve_count > 0)
                                            ? <div className='flex justify-start'>
                                                <span className='w-64'>{t('contract deploy without reverse')}</span>
                                                <span>{autoDecimal(this.state.gas_data_without_reverse.gasFee.toString())} ETH</span>
                                            </div>
                                            : null
                                        }
                                    </div>
                                    : null
                                }
                            </div>
                        }

                        <div className='contract-form'>
                            <h2 className='mb-2'>{t('contract infomation')}</h2>
                            <div className='grid grid-cols-9 gap-8'>
                                <div className="col-span-6">
                                    <div className='ct'>
                                        <div className='info-dl'>
                                            <label>合约地址</label>
                                            <div>
                                            0x374fEB1050EE9F84d03BE7B189A00c911fD65e2a
                                            </div>
                                        </div>
                                        <div className='info-dl'>
                                            <label>Type</label>
                                            <div>
                                                ERC721
                                            </div>
                                        </div>
                                        <div className='info-dl'>
                                            <label>Symbol</label>
                                            <div>
                                                WGG
                                            </div>
                                        </div>
                                        <div className='info-dl'>
                                            <label>Name</label>
                                            <div>
                                                Facebook Inc
                                            </div>
                                        </div>
                                        <div className='info-dl'>
                                            <label>Refundable</label>
                                            <div>
                                                <table className='info-table w-full"'>
                                                    <thead>
                                                        <tr>
                                                            <th>{t('time')}</th>
                                                            <th>{t('refundable ratio')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><span className=''><Showtime unixtime={1} /></span></td>
                                                            <td>{percentDecimal(0.1)}%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 intro">
                                    <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                    <p>{t('You can define your details of your contract here, as well as many customizable function below.')}</p>
                                    <p>{t('DON’T PANIC! You can deploy your contract to Kovan testnet for free, check if everythings is correct, then deploy to Ethereum mainnet.')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-info shadow-sm mb-8">
                            <div>
                                <InformationCircleIcon className='icon-sm'/>
                                <span>以下部分设置，需要支付GAS在合约中进行修改</span>
                            </div>
                        </div>

                        <div class="alert alert-info shadow-sm mb-8">
                            <div>
                                <InformationCircleIcon className='icon-sm'/>
                                <span>以下部分设置，不需要修改合约，会实时生效</span>
                            </div>
                        </div>
                
                        <ContractUpdate contract={contract} club_id={club_id} />

                    </div>


                </div> 
            </div>
    </PageWrapper>
    }
    
}

ContractView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        loadContract : (club_id) => {
            return dispatch(loadContract(club_id))
        },
        saveContract : (data) => {
            return dispatch(saveContract(data))
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
    // console.log('debug03,state',state.toJS())
    // console.log('debug03,contract_id',contract_id)
    // console.log('debug03,contract',contract)

    return {
        'contract' : contract,
        'contract_id' : contract_id,
        'is_fetching' : (contract_load_data) ? contract_load_data.get('is_fetching') : false,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ContractView)
