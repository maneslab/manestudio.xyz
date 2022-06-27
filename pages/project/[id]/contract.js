import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import Immutable from 'immutable';

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import Loading from 'components/common/loading'
import Input from 'components/form/field'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import {initTraitList} from 'redux/reducer/image/trait'
import {loadContract} from 'redux/reducer/contract'
import FormObserver from 'components/form/observer'
import FormSwitch from 'components/form/switch';
import RefundableOne from 'components/contract/refund_one'

import withClubView from 'hocs/clubview'

import { BeakerIcon, DocumentTextIcon, TableIcon, TicketIcon,PlusIcon } from '@heroicons/react/outline'
import {t} from 'helper/translate'

import { Formik, Form, FieldArray,Field } from 'formik';
import * as Yup from 'yup';

import Upload from 'components/common/upload'
import {uploadRequest} from 'helper/http'
import { denormalize } from 'normalizr';
import {contractSchema} from 'redux/schema/index'

@withTranslate
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            is_fetched  : false,
            merged_traits : [],
            generates : [],
            merged_traits: {},
            filter : [],
            filter_trait_ids : Immutable.List([]),
            preview_id : null,
            preview_index : null
        }
        // this.loadGenerateList = ::this.loadGenerateList
        this.formRef = React.createRef();
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
        console.log('debug06,contract',contract.toJS())
        this.formRef.current.setValues(contract.toJS())
    }


    @autobind
    addRefundOne(arrayHelpers) {
        let rl = this.formRef.current.values.refund.length
        let uid =new Date().getTime();
        arrayHelpers.push({ end_time: '', refund_rate: '' ,id : uid});
    }

    render() {
        // const {t} = this.props.i18n;
        const {is_fetching,is_fetched,generates,merged_traits,preview_id,preview_index} = this.state;
        const {club_id,entities} = this.props;

        console.log('debug08,merged_traits',merged_traits)

        /* Object.keys(merged_traits).map(k=>{
            return <div>
                <div>{merged_traits[k]}</div>
                <div>{
                    Object.keys(merged_traits[k]).map(k2=>{
                        return <div>
                        {k2}
                        </div>
                    })
                }</div>
            </div>
        }) */
        //<FormObserver onChange={this.formChange}/>


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
            wl_bluechip_list: "",
            wl_enable: 0,
            wl_end_time: 0,
            wl_max_supply: 0,
            wl_per_address: 0,
            wl_price: "0",
            wl_start_time: 0
        }
        let formSchema = Yup.object().shape({
            name      : Yup.string().required(),
            project_type : Yup.string().required(),
            width       :  Yup.number().min(512).max(2048).required(),
            height      :  Yup.number().min(512).max(2048).required(),
        });

        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=avatar',
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
                                        {t('default setting')}
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <BeakerIcon className='icon-base' />
                                        {t('refundable')}
                                    </a>
                                </li>

                                <li>
                                    <a>
                                        <TableIcon className='icon-base' />
                                        {t('whitelist')}
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <TicketIcon className='icon-base' />
                                        {t('public sale')}
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

                    <div className="col-span-10">

                        
                        <Formik
                            innerRef={this.formRef}
                            initialValues={init_data}
                            validationSchema={formSchema}
                            onSubmit={this.submitForm}>
                            {({ values,errors, touched }) => (
                                
                                <Form className="w-full">
                                
                                <FormObserver />

                                <div className='contract-form'>
                                    <h2>{t('contract basics')}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>
                                                <Input name="name" label={t("contract name")} placeholder={"E.g. weirdo ghost gang"} />
                                                <Input name="symbol" label={"symbol"} placeholder={"E.g. WGG"} />
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <Input name="type" label={t("type")} value={"ERC-721A"} readOnly={true} placeholder={"E.g. weirdo ghost gang"} />
                                                    <Input name="max_token_supply" label={"max token supply"} value={5000} readOnly={true} />
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
                                    <h2>{'ASCII mark'}</h2>
                                    <div className='grid grid-cols-9 gap-8'>
                                        <div className="col-span-6">
                                            <div className='ct'>

                                                <label class="label"><span class="label-text">ASCII art text generator</span></label>

                                                <div className='flex justify-between items-center mb-8'>
                                                    <div className='flex-grow mr-8 items-center'>
                                                        <input className='input-box' name="ascii_text" label={t("ASCII art text generator")} placeholder={"any text"} />
                                                    </div>
                                                    <a className='btn btn-primary'>LFG!</a>
                                                </div>

                                                
                                                <label class="label"><span class="label-text">ASCII art image generator</span></label>
                                                <div className='flex justify-between'>
                                                    <Upload uploadProps={uploadProps} afterSuccess={()=>{

                                                    }}>  
                                                        <button type="button" className='btn w-full'>
                                                            <PlusIcon className='w-4 mr-2' /> {t('upload image')}
                                                        </button>
                                                    </Upload>
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

                                
                                    <FieldArray
                                        name="refund"
                                        render={arrayHelpers => (

                                            <div className='contract-form'>
                                                <div className='grid grid-cols-9 gap-8'>
                                                <div className='col-span-6 mb-4'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <div className='flex justify-start items-center'>
                                                            <h2>{'Refundable'}</h2>
                                                            <div class="form-control ml-4">
                                                                <label class="label cursor-pointer">
                                                                    <FormSwitch name={"refund_enable"} className="toggle toggle-primary"/>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className='flex justify-between items-center'>
                                                            <button
                                                            type="button"
                                                            className='btn btn-default'
                                                            onClick={this.addRefundOne.bind({},arrayHelpers)}
                                                            >
                                                                <PlusIcon className='w-4 mr-2' /> {t('add refundable period')}
                                                            </button>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                                <div className='grid grid-cols-9 gap-8'>
                                                    <div className="col-span-6">

                                                        {values.refund.map((one,index) => <RefundableOne 
                                                            remove={arrayHelpers.remove}
                                                            key={one.id} 
                                                            id={one.id}
                                                            index={index}
                                                            errors={errors['refund'] ? errors['refund'][index] : null}
                                                            refund={one}
                                                        />)}

                                                    </div>
                                                    <div className="col-span-3 intro">
                                                        <p>{t('ERC-721a is the contract standard of minting 1 of 1 NFTs, optimized from classic ERC-721 standard to lower the gas usage.')}</p>
                                                        <p>{t('You can define your details of your contract here, as well as many customizable function below.')}</p>
                                                        <p>{t('DON’T PANIC! You can deploy your contract to Kovan testnet for free, check if everythings is correct, then deploy to Ethereum mainnet.')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                    />


                            </Form>
                            )}
                        </Formik>

                       






                    </div>

                </div> 
            </div>
    </PageWrapper>
    }
    
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        loadContract : (club_id) => {
            return dispatch(loadContract(club_id))
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
    console.log('debug03,state',state.toJS())

    console.log('debug03,contract_id',contract_id)
    console.log('debug03,contract',contract)

    return {
        'contract' : contract,
        'contract_id' : contract_id,
        'is_fetching' : (contract_load_data) ? contract_load_data.get('is_fetching') : false,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
