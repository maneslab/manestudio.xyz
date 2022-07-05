import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
// import Immutable from 'immutable';

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import Input from 'components/form/field'
import Button from 'components/common/button'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'
import Showtime from 'components/time/showtime'
import SwitchChainButton from 'components/wallet/switch_chain';

import {loadContract,saveContract} from 'redux/reducer/contract'
import FormSwitch from 'components/form/switch';
import RefundableOne from 'components/contract/refund_one'
import RevenueShareOne from 'components/contract/revenue_one'
import ExpiretimeSelect from 'components/form/expiretime_select';
import BluechipSelect from 'components/form/mane/bluechip_select';
import WhitelistUpload from 'components/form/mane/upload_whitelist_csv';
import UploadPlaceholderModal from 'components/contract/placeholder_modal';
import ContractSide from 'components/contract/side';
import {ethers} from 'ethers'
import notification from 'components/common/notification'

import manestudio from 'helper/web3/manestudio';

import withClubView from 'hocs/clubview'

import {  PlusIcon, UploadIcon, InformationCircleIcon,  } from '@heroicons/react/outline'
import {t} from 'helper/translate'

import { Formik, Form, FieldArray,Field } from 'formik';
import * as Yup from 'yup';

import Upload from 'components/common/upload'
import {httpRequest, uploadRequest} from 'helper/http'
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
            is_estimate_ing : false
        }
        // this.loadGenerateList = ::this.loadGenerateList
        this.formRef = React.createRef();

        this.submitForm = ::this.submitForm
    }

    componentDidMount() {
        if (this.props.club_id) {
            this.props.loadContract(this.props.club_id);
        }
        if (this.props.contract) {
            this.setForm(this.props.contract)
        }
        // 
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.props.loadContract(this.props.club_id);
        }

        if (this.props.contract && !this.props.contract.equals(prevProps.contract)) {
            this.setForm(this.props.contract)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    @autobind
    setForm(contract) {

        // console.log('debug10,contract->',contract.toJS());
        let contract_data = this.formatContractData(contract);

        // console.log('debug10,contract_data->',contract_data);
        this.formRef.current.setValues(contract_data)
    }

    @autobind
    formatContractData(contract) {

        let refund = contract.get('refund');
        let contract_data = contract.toJS();

        let number_map = ['pb_enable','wl_enable','delay_reveal_enable','refund_enable'];

        number_map.map(one=>{
            contract_data[one] = Number(contract_data[one])
        })
        
        // console.log('debug10,formatContractData',contract_data);

        return contract_data;
    }

    @autobind
    addRefundOne(arrayHelpers) {
        let rl = this.formRef.current.values.refund.length
        let uid =new Date().getTime();
        arrayHelpers.push({ end_time: '', refund_rate: '' ,id : uid});
    }

    @autobind
    addShareOne(arrayHelpers) {
        let rl = this.formRef.current.values.revenue_share.length
        let uid =new Date().getTime();
        arrayHelpers.push({ address: '', rate: '' ,id : uid});
    }

    @autobind
    toggleModal(name) {
        this.setState({
            [name]: !this.state[name]
        })
    }

    @autobind
    formatData(values) {
        //添加clubid 
        values.club_id = this.props.club_id;

        //整理refund数据
        values.refund = JSON.stringify(values.refund);

        //整理revenue_share数据
        values.revenue_share = JSON.stringify(values.revenue_share);

        //清理为0的字段
        if (values.placeholder_img_id == 0) {
            delete values.placeholder_img_id
        }

        if (values.placeholder_img) {
            values.placeholder_img_id = values.placeholder_img.img_id
        }

        if (values.placeholder_video_id == 0) {
            delete values.placeholder_video_id
        }

        if (values.placeholder_video) {
            values.placeholder_video_id = values.placeholder_video.id
        }

        return values;
    }

    async submitForm(values) {
        console.log('submitForm',values)

        ///清理数据结构
        let values_deepclone = JSON.parse(JSON.stringify(values))

        let format_data = this.formatData(values_deepclone)

        this.setState({
            'is_saving' : true
        })
        this.props.saveContract(format_data);

        this.setState({
            'is_saving' : false
        })
    }

    @autobind
    fetchAsc2MarkFromText(text,setFieldValue) {

        let that = this;
        httpRequest({
            url: '/v1/upload/ascii',
            method : 'GET',
            data  : {
                text : text,
                cols : 43
            }
        }).then(result=>{
            console.log('result',result);
            setFieldValue('asc2mark',result.data)
        })
    }

    @autobind
    fetchAsc2Mark(imgdata,setFieldValue) {
        // console.log('debugasc.imgdata',imgdata);

        let that = this;
        httpRequest({
            url: '/v1/upload/ascii',
            method : 'GET',
            data  : {
                id : imgdata.data.img_id,
                cols : 43
            }
        }).then(result=>{
            // console.log('result',result);
            setFieldValue('asc2mark',result.data)
        })
    }

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

        this.setState({
            is_estimate_ing : false
        })
        // console.log('estimateGasDepositToken得到的gas_data：',gas_data);
        // console.log('estimateGasDepositToken得到的gas_fee：',gas_data.gasFee.toString());
        notification.info({
            'message' : '预估Gas费用',
            'description': '预计需要的GAS费用是:'+autoDecimal(gas_data.gasFee.toString())+'ETH'
        });

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
        const {is_fetching,is_fetched,generates,merged_traits,preview_id,preview_index} = this.state;
        const {club_id,club,contract,wallet,chain,chains} = this.props;

        console.log('wallet-test',wallet,chain,chains)

        let init_data = {
            asc2mark: "",
            name: "",
            pb_enable: 0,
            pb_end_time: 0,
            pb_per_address: 0,
            pb_price: "0",
            pb_start_time: 0,
            placeholder_img_id: 0,
            placeholder_video_id: 0,
            refund: [],
            refund_enable: 0,
            reveal_time: 0,
            stop_mint: 0,
            symbol: "",
            whitelist_count : 0,
            wl_bluechip_list: "",
            wl_enable: 0,
            wl_end_time: 0,
            wl_max_supply: 0,
            wl_per_address: 0,
            wl_price: "0",
            wl_start_time: 0,
            max_supply : 0,
            revenue_share : []
        }
        let formSchema = Yup.object().shape({
            name      : Yup.string().required(),
        });

        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=post_image',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        let empty_placeholder = <div className='bg-gray-100 w-64 h-64 flex justify-center items-center flex-col text-gray-400'>
            <UploadIcon className='icon-base mb-4'/>
            <div>{t('upload placeholder art')}</div>
            <div>jpg / png / gif / mp4</div>
        </div>

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
                            ? <div className='bg-white p-4 pl-8 mb-8 flex justify-between items-center'>
                                <span className="capitalize">{t('you are connecting to the ETH mainnet')}</span>
                                <SwitchChainButton />
                            </div>
                            : <div className='bg-white p-4 pl-8 mb-8 flex justify-between items-center'>
                                <span className="capitalize">{t('you are connecting to the ETH testnet')} {chain.name}</span>
                                <div className='flex justify-end items-center'>
                                    <Button loading={this.state.is_estimate_ing} className='btn btn-default mr-2' onClick={this.estimateGas}>estimate gas fee</Button>
                                    <Button loading={this.state.is_deploy_contract} className='btn btn-primary' onClick={this.deploy}>deploy</Button>
                                </div>
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
                        
                        <Formik
                            innerRef={this.formRef}
                            initialValues={init_data}
                            validationSchema={formSchema}
                            onSubmit={this.submitForm}>
                            {({ values,errors,setFieldValue }) => (
                                
                                <Form className="w-full">
                                
                                {console.log('form.value',values)}




                                <div className='contract-form'>
                                    <div className='grid grid-cols-9 gap-8'>
                                    <div className='col-span-6 mb-4'>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='flex justify-start items-center title'>
                                                <h2 className='mb-0'>{'whitelist'}</h2>
                                                <div class="form-control ml-4">
                                                    <label class="label cursor-pointer">
                                                        <FormSwitch name={"wl_enable"} className="toggle toggle-primary"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            {
                                                (values.wl_enable && values.wl_enable > 0)
                                                ? <div className='ct'>

                                                   <Input name="wl_price" label={"whitelist mint price"} placeholder={"e.g 0.05"} />

                                                    <div className='divider' />

                                                    <BluechipSelect name={"wl_bluechip_list"} label={t("whitelist for selected bluechip")} />

                                                    <WhitelistUpload label={t("upload whitelist csv file")} club_id={club_id} value={values.whitelist_count} setFieldValue={setFieldValue}/>

                                                </div>
                                                : <div className='ct text-gray-400 capitalize'>
                                                    {t('whitelist is disabled')}
                                                </div>
                                            }
                                            
                                        </div>
                                        <div className="col-span-3 intro">
                                            <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='contract-form'>
                                    <div className='grid grid-cols-9 gap-8'>
                                    <div className='col-span-6 mb-4'>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='flex justify-start items-center title'>
                                                <h2 className='mb-0'>{'delayed reveal'}</h2>
                                                <div class="form-control ml-4">
                                                    <label class="label cursor-pointer">
                                                        <FormSwitch name={"delay_reveal_enable"} className="toggle toggle-primary"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            {
                                                (values.delay_reveal_enable && values.delay_reveal_enable > 0)
                                                ? <div className='ct'>
                                                            
                                                    <div className='form-control'>
                                                        <label className='label'>
                                                            <span className='label-text'>{t('pre-reveal placeholder')}</span>
                                                        </label>
                                                        <div className='flex justify-start'>
                                                            {
                                                                (values && values.placeholder_video)
                                                                ? <div className='placeholder-img-wapper'>
                                                                    <video autoplay muted loop src={values.placeholder_video.url}>
                                                                    </video>
                                                                </div>
                                                                : <>
                                                                    {
                                                                        (values && values.placeholder_img)
                                                                        ? <div className='placeholder-img-wapper'>
                                                                            <img src={values.placeholder_img.image_urls.url} />
                                                                        </div>
                                                                        : empty_placeholder
                                                                    }
                                                                </>
                                                            }
                                                            <a className='btn btn-default ml-4' onClick={this.toggleModal.bind({},'show_upload_modal')}>
                                                                <PlusIcon className='w-4 mr-2' /> {t('add pre-reveal placeholder')}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <ExpiretimeSelect label={t('auto reveal at')} name={'reveal_time'}  />
        
                                                </div>
                                                : <div className='ct text-gray-400 capitalize'>
                                                    {t('delayed reveal is disabled')}
                                                </div>
                                            }
                                            
                                        </div>
                                        
                                        <div className="col-span-3 intro">
                                            <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                        </div>
                                    </div>

                                    
                                </div>
                            
                                <UploadPlaceholderModal club={club} visible={this.state.show_upload_modal} closeModal={this.toggleModal.bind({},'show_upload_modal')} setFieldValue={setFieldValue}/>


                       
           

                        </Form>
                            )}
                        </Formik>

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
