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

import {loadContract,saveContract} from 'redux/reducer/contract'
import FormSwitch from 'components/form/switch';
import RefundableOne from 'components/contract/refund_one'
import RevenueShareOne from 'components/contract/revenue_one'
import ExpiretimeSelect from 'components/form/expiretime_select';
import BluechipSelect from 'components/form/mane/bluechip_select';
import WhitelistUpload from 'components/form/mane/upload_whitelist_csv';
import UploadPlaceholderModal from 'components/contract/placeholder_modal';

import withClubView from 'hocs/clubview'

import { BeakerIcon, DocumentTextIcon, PlusIcon, UploadIcon, InformationCircleIcon,  } from '@heroicons/react/outline'
import {t} from 'helper/translate'

import { Formik, Form, FieldArray,Field } from 'formik';
import * as Yup from 'yup';

import Upload from 'components/common/upload'
import {httpRequest, uploadRequest} from 'helper/http'
import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'

@withTranslate
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class ContractView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            is_fetched  : false,
            is_saveing  : false,
            show_upload_modal : false,
            asc2text : ''
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
 
    render() {
        // const {t} = this.props.i18n;
        const {is_fetching,is_fetched,generates,merged_traits,preview_id,preview_index} = this.state;
        const {club_id,club,contract} = this.props;

        let init_data = {
            asc2mark: "",
            name: "",
            pb_enable: 0,
            pb_end_time: 0,
            pb_per_address: 0,
            pb_price: "0",
            pb_start_time: 0,
            placeholder_img_id: 0,
            placeholder_mp4_url: 0,
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

        return <PageWrapper>
            <Head>
                <title>{t('contract')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={'smart contract'}/>

                <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">

                    <div className="col-span-2">
                        <div className='block-left-menu'>
                            <h3 className='font-bold capitalize mb-4'>{t('setting')}</h3>
                            <ul>
                                <li>
                                    <a>
                                        <DocumentTextIcon className='icon-base' />
                                        {t('setting')}
                                    </a>
                                </li>
                               
                            </ul>
                            <div className='divider' />
                            <h3 className='font-bold capitalize mb-4'>{t('deploy')}</h3>
                            <ul>
                                <li>
                                    <a>
                                        <DocumentTextIcon className='icon-base' />
                                        {t('Testnet')}
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <BeakerIcon className='icon-base' />
                                        {t('Maintain')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <a></a>
                    </div>

                    <div className="col-span-10 pb-24">
                        <div class="alert alert-info shadow-sm mb-8">
                            <div>
                                <InformationCircleIcon className='icon-sm'/>
                                <span>以下部分设置，需要重新发布合约才会生效</span>
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
                                    <h2 className='mb-2'>{t('contract basics')}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>
                                                <Input name="name" label={t("contract name")} placeholder={"E.g. weirdo ghost gang"} />
                                                <Input name="symbol" label={"symbol"} placeholder={"E.g. WGG"} />
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <Input name="type" label={t("type")} value={"ERC-721A"} readOnly={true} placeholder={"E.g. weirdo ghost gang"} />
                                                    <Input name="max_supply" label={"max token supply"} readOnly={true} disabled />
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

                                <div className='contract-form'>
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
                                                                })}} label={t("ASCII art text generator")} placeholder={"any text"} />
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
                                                            <h2 className='mb-0'>{'Refundable'}</h2>
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
                                                            : <div className='p-6 bg-white text-gray-400 capitalize'>
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

                                                    <ExpiretimeSelect label={t('whitelist presale start time')} name={'wl_start_time'}  />
                                                    <ExpiretimeSelect label={t('whitelist presale end time')} name={'wl_end_time'}  />

                                                    <Input name="wl_max_supply" label={"whitelist max supply"} placeholder={"cannot exceed total supply"} />
                                                    <Input name="wl_per_address" label={"whitelist token limit per wallet"} placeholder={"limit how many token pre wallet can mint"} />
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
                                                <h2 className='mb-0'>{'public sale'}</h2>
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
                                                    <ExpiretimeSelect label={t('public sale end time')} name={'pb_end_time'}  />

                                                    <Input name="pb_per_address" label={"public sale token limit per wallet"} placeholder={"limit how many token pre wallet can mint"} />
                                                    <Input name="pb_price" label={"public sale mint price"} placeholder={"e.g 0.05"} />

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
                                                                (values && values.placeholder_img)
                                                                ? <div className='placeholder-img-wapper'>
                                                                    <img src={values.placeholder_img.image_urls.url} />
                                                                </div>
                                                                : <div className='bg-gray-100 w-64 h-64 flex justify-center items-center flex-col text-gray-400'>
                                                                    <UploadIcon className='icon-base mb-4'/>
                                                                    <div>{t('upload placeholder art')}</div>
                                                                    <div>jpg / png / gif / mp4</div>
                                                                </div>
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
                                                        <h2 className='mb-0'>{'Revenue Share'}</h2>
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
                                                            {
                                                                console.log('debug:show_values',values,values.refund)
                                                            }
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
                                                        : <div className='p-6 bg-white text-gray-400 capitalize'>
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


                       
                        <div className='fixed bottom-0 left-0 w-full py-4 bg-white border-t border-gray-300' style={{'zIndex':9999}}>
                            <div className='max-w-screen-xl mx-auto grid grid-cols-12 gap-8'>
                                <div className='col-span-2'></div>
                                <div className='col-span-10'>
                                    <Button type="submit" loading={this.state.is_saveing} className='btn btn-primary -ml-1'>{t('save')}</Button>
                                </div>
                            </div>
                        </div>

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
