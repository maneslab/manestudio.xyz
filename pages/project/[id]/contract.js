import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import classNames from 'classnames';

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ContractStep from 'components/contract/step'
import Input from 'components/form/field'
import Button from 'components/common/button'
import message from 'components/common/message'
import FormObserver from 'components/form/observer'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import {loadContract,saveContract} from 'redux/reducer/contract'
import FormSwitch from 'components/form/switch';
import RefundableOne from 'components/contract/refund_one'
import RevenueShareOne from 'components/contract/revenue_one'
import ExpiretimeSelect from 'components/form/expiretime_select';
import BluechipSelect from 'components/form/mane/bluechip_select';
import WhitelistUpload from 'components/form/mane/upload_whitelist_csv';
import UploadPlaceholderModal from 'components/contract/placeholder_modal';
import EmptyPlaceholder from 'components/common/empty_placeholder'
import PublicEndTimeSelect from 'components/form/mane/public_endtime_select';

import ContractSide from 'components/contract/side'
import withClubView from 'hocs/clubview'
import withNotice from 'hocs/notice'

import {  PlusIcon,   } from '@heroicons/react/outline'
import {removeSuffixZero} from 'helper/number'
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {InformationCircleIcon} from '@heroicons/react/outline'

import Upload from 'components/common/upload'
import {httpRequest, uploadRequest} from 'helper/http'
import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'

@withTranslate
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
@withNotice
class ContractView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            is_fetched  : false,
            is_saveing  : false,
            show_upload_modal : false,
            asc2text : '',

            form_data : {
                pb_enable : 0,
                wl_enable : 0,
                delay_reveal_enable : 0,
                refund_enable : 0,
                revenue_share_enable : 0,
            }
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
        const {setDefaultNotice} = this.props;
        setDefaultNotice(1,<div>测试代码default</div>)
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

        let number_map = ['pb_enable','wl_enable','delay_reveal_enable','refund_enable','revenue_share_enable'];

        number_map.map(one=>{
            contract_data[one] = Number(contract_data[one])
        })

        if (contract_data['pb_end_time'] > 0) {
            contract_data['pb_end_time_enable'] = 1;
        }else {
            contract_data['pb_end_time_enable'] = 0;
        }
        
        let price = ['wl_price','pb_price'];
        price.map(one=>{
            // contract_data[one] = parseFloat(contract_data[one])
            contract_data[one] = removeSuffixZero(contract_data[one])
        });

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

        // console.log('debug88,values',values)

        //添加clubid 
        values.club_id = this.props.club_id;


        //整理refund数据
        if (values.refund_enable) {
            values.refund = JSON.stringify(values.refund);
        }else {
            values.refund = JSON.stringify([]);
        }

        //整理revenue_share数据
        if (values.revenue_share_enable) {
            values.revenue_share = JSON.stringify(values.revenue_share);
        }else {
            values.revenue_share = JSON.stringify([]);
        }

        if (!values.wl_enable) {
            delete values['wl_bluechip_list'];
            delete values['wl_end_time'];
            delete values['wl_max_supply'];
            delete values['wl_per_address'];
            delete values['wl_price'];
            delete values['wl_start_time'];
        }


        if (!values.pb_enable) {
            delete values['pb_end_time'];
            delete values['pb_end_time_enable'];
            delete values['pb_per_address'];
            delete values['pb_price'];
            delete values['pb_start_time'];
        }else {
            if (!values.pb_end_time_enable) {
                values.pb_end_time = 0;
            }
        }

        if (!values.delay_reveal_enable){
            delete values['reveal_time']
            delete values['placeholder_img']
            delete values['placeholder_video']
        }

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
        // console.log('debug-form,values',values)

        const {t} = this.props.i18n;

        ///清理数据结构
        let values_deepclone = JSON.parse(JSON.stringify(values))

        let format_data = this.formatData(values_deepclone)

        this.setState({
            'is_saving' : true
        })
        try {
            let result = await this.props.saveContract(format_data);
            console.log('debug88-result',result);
            if (result.status == 'success') {
                message.success(t('save success'));
            }else {
                message.error(t('save failed'));
            }

        }catch(e) {
            message.error(t('save failed'));
        }

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
    formChange(values) {
        let new_form_data = {
            pb_enable : values.pb_enable,
            wl_enable : values.wl_enable,
            delay_reveal_enable :   values.delay_reveal_enable,
            refund_enable : values.refund_enable,
            revenue_share_enable : values.revenue_share_enable,
        }
        this.setState({
            form_data : new_form_data
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {form_data} = this.state;
        const {club_id,club,contract,getNotice,setNotice} = this.props;

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
            revenue_share : [],
            pb_end_time_enable : 0
        }

        let formSchema = Yup.object().shape({
            name      : Yup.string().required(),
            symbol    : Yup.string().required(),
            refund    : Yup.array().when('refund_enable', {
                is: true,
                then : Yup.array().of(Yup.object().shape({
                    end_time : Yup.number().integer().required(),
                    refund_rate : Yup.number().max(1).moreThan(0).required(),
                }))
            }),
            refund_enable : Yup.boolean(),
            wl_enable : Yup.boolean(),
            wl_start_time : Yup.number().when('wl_enable', {
                is: true,
                then : Yup.number().integer().moreThan(0).required()
            }),
            wl_end_time : Yup.number().when('wl_enable', {
                is: true,
                then : Yup.number().integer().moreThan(Yup.ref('wl_start_time'),t('must over then start time')).required()
            }),
            wl_max_supply : Yup.number().integer().max(Yup.ref('max_supply')).when('wl_enable', {
                is: true,
                then : Yup.number().integer().moreThan(0).required()
            }),
            wl_per_address : Yup.number().integer().when('wl_enable', {
                is: true,
                then : Yup.number().integer().moreThan(0).required()
            }),
            wl_price : Yup.number().when('wl_enable', {
                is: true,
                then : Yup.number().moreThan(0).required()
            }),

            pb_enable : Yup.boolean(),
            pb_start_time : Yup.number().when('pb_enable', {
                is: true,
                then : Yup.number().integer().moreThan(0).required()
            }),
            pb_end_time_enable : Yup.boolean(),
            pb_end_time : Yup.number().when('pb_end_time_enable', {
                is: true,
                then : Yup.number().integer().moreThan(Yup.ref('pb_start_time'),t('must over then start time')).required()
            }),
            pb_per_address : Yup.number().integer().when('pb_enable', {
                is: true,
                then : Yup.number().integer().moreThan(0).required()
            }),
            pb_price : Yup.number().when('pb_enable', {
                is: true,
                then : Yup.number().moreThan(0).required()
            }),


            delay_reveal_enable : Yup.boolean(),

            reveal_time : Yup.number().when('delay_reveal_enable', {
                is: true,
                then :  Yup.number().moreThan(0).required()
            }),

            revenue_share_enable : Yup.boolean(),

            revenue_share : Yup.array().when('revenue_share_enable', {
                is: true,
                then : Yup.array().of(Yup.object().shape({
                    address : Yup.string().trim().matches(/^0x[a-fA-F0-9]{40}$/, 'not eth wallet address').required(),
                    rate : Yup.number().max(1).moreThan(0).required(),
                }))
            }),


        });

        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=post_image',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        let is_lock = false;
        if (club && club.get('is_lock')) {
            is_lock = true;
        }
                                /* console.log('debug-form,errors',errors) */

        return <PageWrapper>
            <Head>
                <title>{t('contract')}</title>
            </Head>
            <div>
                <ClubHeader club={club} title={t('smart contract')} active_id={2} intro={null}/>
           
                <ContractStep club_id={club_id} active_name={'setting'} contract={contract} next_step={(contract)?true:false} />

                <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">


                    <div className="col-span-12 pb-24">
                        
                        <h1 className='h1'>{t('contract setting')}</h1>

                        <div className='divider'></div>

                        {
                            (is_lock)
                            ? <div>
                                <div class="alert alert-info shadow-sm mb-8">
                                    <div>
                                        <InformationCircleIcon className='icon-sm'/>
                                        <span>{t('lock-info')}</span>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        <div className={classNames({"hidden":is_lock})}>
                        <Formik
                            innerRef={this.formRef}
                            initialValues={init_data}
                            validationSchema={formSchema}
                            onSubmit={this.submitForm}>
                            {({ values,errors,setFieldValue }) => {
                                

                                return (
                                
                                <Form className="w-full">
                                
                                <FormObserver onChange={this.formChange}/>

                                <div className='contract-form'>
                                    <h2 className='mb-2'>{t('contract basics')}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>
                                                <Input name="name" label={t("contract name")} onlyEnglish={true} placeholder={"E.g. weirdo ghost gang"} setNotice={setNotice.bind({},1)} side_notice={<div>测试代码</div>}/>
                                                <Input name="symbol" label={"symbol"} onlyEnglish={true} placeholder={"E.g. WGG"} />
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <Input name="type" label={t("type")} value={"ERC-721A"} readOnly={true} disabled placeholder={"E.g. weirdo ghost gang"} />
                                                    <Input name="max_supply" label={t("max token supply")} readOnly={true} disabled />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 intro">
                                            {
                                                getNotice(1)
                                            }
                                       </div>
                                    </div>
                                </div>

                                <div className='contract-form hidden'>
                                    <h2 className='mb-2'>{'ASCII mark'}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>

                                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                                    <div>
                                                        <label class="label"><span class="label-text">ASCII art {t('text generator')}</span></label>

                                                        <div className='flex justify-between items-center mb-4'>
                                                            <div className='flex-grow mr-2 items-center'>
                                                                <input className='input-box' value={this.state.asc2text} onChange={(e)=>{this.setState({
                                                                    asc2text: e.target.value
                                                                })}} maxlength={6} label={t("ASCII art text generator")} placeholder={"any text"} />
                                                            </div>
                                                            <a className='btn btn-default' onClick={()=>{
                                                                this.fetchAsc2MarkFromText(this.state.asc2text,setFieldValue)
                                                            }}>LFG!</a>
                                                        </div>
                                                    </div>
                                                    <div className=''>
                                                        <label class="label"><span class="label-text">ASCII art {t('image generator')}</span></label>
                                                        <div className='flex justify-between'>
                                                            <Upload uploadProps={uploadProps} afterSuccess={(asc_result)=>{
                                                                this.fetchAsc2Mark(asc_result,setFieldValue);
                                                            }}>  
                                                                <button type="button" className='btn w-full'>
                                                                    <PlusIcon className='w-4 mr-2' /> {t('upload image')}
                                                                </button>
                                                            </Upload>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                {
                                                    (values.asc2mark) 
                                                    ? <div className=''>
                                                        <div className='flex justify-between items-center mb-2'>
                                                            <label class="label"><span class="label-text">ASCII mark {t('preview')}</span></label>
                                                            <a className='btn btn-outline btn-xs' onClick={()=>setFieldValue('asc2mark','')}>{t('remove')}</a>
                                                        </div>
                                                        <div className='border-2 border-black p-4'>
                                                            <pre className='text-xs leading-4'>
                                                                {values.asc2mark}
                                                            </pre>
                                                            
                                                        </div>
                                                    </div>
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

                                
                                    <FieldArray
                                        name="refund"
                                        render={arrayHelpers => (

                                            <div className='contract-form'>
                                                <div className='grid grid-cols-9 gap-8'>
                                                <div className='col-span-6 mb-4'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <div className='flex justify-start items-center title'>
                                                            <h2 className='mb-0'>{t('refundable')}</h2>
                                                            <div class="form-control ml-4">
                                                                <label class="label cursor-pointer">
                                                                    <FormSwitch name={"refund_enable"} className="toggle toggle-primary"/>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className='flex justify-between items-center'>
                                                            {
                                                                (values.refund_enable)
                                                                ? <button
                                                                    type="button"
                                                                    className='btn btn-default'
                                                                    onClick={this.addRefundOne.bind({},arrayHelpers)}
                                                                    >
                                                                        <PlusIcon className='w-4 mr-2' /> {t('add refundable period')}
                                                                    </button>
                                                                : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                                <div className='grid grid-cols-9 gap-8'>
                                                    <div className="col-span-6">
                                                        {
                                                            (values.refund_enable) 
                                                            ? <div>
                                                                {
                                                                    console.log('debug10->refund',values.refund)
                                                                }
                                                                {values.refund.map((one,index) => <RefundableOne 
                                                                    remove={arrayHelpers.remove}
                                                                    key={one.id} 
                                                                    id={one.id}
                                                                    index={index}
                                                                    errors={errors['refund'] ? errors['refund'][index] : null}
                                                                    refund={one}
                                                                />)}
                                                                {
                                                                    (values.refund.length == 0)
                                                                    ? <div className='ct text-center '>
                                                                        {t('click add to add a refundable period')}
                                                                    </div>
                                                                    : null
                                                                }
                                                            </div>
                                                            : <div className='p-6 d-bg-c-1 text-gray-400 capitalize'>
                                                                {t('refund is disabled')}
                                                            </div>
                                                        }
                                                        

                                                    </div>
                                                    <div className="col-span-3 intro">
                                                        <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                    />




                                <div className='contract-form'>
                                    <div className='grid grid-cols-9 gap-8'>
                                    <div className='col-span-6 mb-4'>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='flex justify-start items-center title'>
                                                <h2 className='mb-0'>{t('whitelist')}</h2>
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

                                                    <ExpiretimeSelect label={t('whitelist presale start time')} name={'wl_start_time'}  />
                                                    <ExpiretimeSelect label={t('whitelist presale end time')} name={'wl_end_time'}  />

                                                    <Input name="wl_max_supply" label={t("whitelist max supply")} placeholder={"cannot exceed total supply"} />
                                                    <Input name="wl_per_address" label={t("whitelist token limit per wallet")} placeholder={"limit how many token pre wallet can mint"} />
                                                    <Input name="wl_price" label={t("whitelist mint price")} placeholder={"e.g 0.05"} />

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
                                                <h2 className='mb-0'>{t('public sale')}</h2>
                                                <div class="form-control ml-4">
                                                    <label class="label cursor-pointer">
                                                        <FormSwitch name={"pb_enable"} className="toggle toggle-primary"/>
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
                                                (values.pb_enable && values.pb_enable > 0)
                                                ? <div className='ct'>

                                                    <ExpiretimeSelect label={t('public sale start time')} name={'pb_start_time'}  />
                                                    
                                                    <PublicEndTimeSelect label={t('public sale end time')} name={'pb_end_time'} pb_enable={values.pb_end_time_enable}/>


                                                    <Input name="pb_per_address" label={t("public sale token limit per wallet")} placeholder={"limit how many token pre wallet can mint"} />
                                                    <Input name="pb_price" label={t("public sale mint price")} placeholder={"e.g 0.05"} />

                                                </div>
                                                : <div className='ct text-gray-400 capitalize'>
                                                    {t('public sale is disabled')}
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
                                                <h2 className='mb-0'>{t('delayed reveal')}</h2>
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
                                                                        : <EmptyPlaceholder t={t} />
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

                                <FieldArray
                                    name="revenue_share"
                                    render={arrayHelpers => (

                                        <div className='contract-form'>
                                            <div className='grid grid-cols-9 gap-8'>
                                            <div className='col-span-6 mb-4'>
                                                <div className='flex justify-between items-center w-full'>
                                                    <div className='flex justify-start items-center title'>
                                                        <h2 className='mb-0'>{t('revenue share')}</h2>
                                                        <div class="form-control ml-4">
                                                            <label class="label cursor-pointer">
                                                                <FormSwitch name={"revenue_share_enable"} className="toggle toggle-primary"/>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between items-center'>
                                                        {
                                                            (values.revenue_share_enable)
                                                            ? <button
                                                                type="button"
                                                                className='btn btn-default'
                                                                onClick={this.addShareOne.bind({},arrayHelpers)}
                                                                >
                                                                    <PlusIcon className='w-4 mr-2' /> {t('add share account')}
                                                                </button>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            <div className='grid grid-cols-9 gap-8'>
                                                <div className="col-span-6">
                                                    {
                                                        (values.revenue_share_enable) 
                                                        ? <div>
                                                            {values.revenue_share.map((one,index) => <RevenueShareOne 
                                                                remove={arrayHelpers.remove}
                                                                key={one.id} 
                                                                id={one.id}
                                                                index={index}
                                                                errors={errors['revenue_share'] ? errors['revenue_share'][index] : null}
                                                                refund={one}
                                                            />)}
                                                            {
                                                                (values.revenue_share.length == 0)
                                                                ? <div className='ct text-center '>
                                                                    {t('click add to add a share account')}
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                        : <div className='p-6 d-bg-c-1 text-gray-400 capitalize'>
                                                            {t('revenue sharing is disabled , all income only could withdraw by owner')}
                                                        </div>
                                                    }
                                                    

                                                </div>
                                                <div className="col-span-3 intro">
                                                    <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                />


                            
                                <UploadPlaceholderModal club={club} visible={this.state.show_upload_modal} closeModal={this.toggleModal.bind({},'show_upload_modal')} setFieldValue={setFieldValue}/>


                       
                        <div className='fixed bottom-0 left-0 w-full py-4 d-bg-c-1 border-t d-border-c-1' style={{'zIndex':9999}}>
                            <div className='max-w-screen-xl mx-auto grid grid-cols-9 gap-8'>
                                <div className='col-span-6 flex justify-end'>
                                    <Button type="submit" loading={this.state.is_saveing} className='btn btn-primary -ml-1'>{t('save')}</Button>
                                </div>
                                <div className='col-span-3'>
                                </div>
                            </div>
                        </div>

                        </Form>
                            )}}
                        </Formik>
                        
                        </div>

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
    return {
        'contract' : contract,
        'contract_id' : contract_id,
        'is_fetching' : (contract_load_data) ? contract_load_data.get('is_fetching') : false,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ContractView)
