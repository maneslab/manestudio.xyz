import React from 'react';

import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import Input from 'components/form/field'
import Button from 'components/common/button'

import withTranslate from 'hocs/translate';
import EmptyPlaceholder from 'components/common/empty_placeholder'

import {saveContract} from 'redux/reducer/contract'
import FormSwitch from 'components/form/switch';
import ExpiretimeSelect from 'components/form/expiretime_select';
import BluechipSelect from 'components/form/mane/bluechip_select';
import WhitelistUpload from 'components/form/mane/upload_whitelist_csv';
import UploadPlaceholderModal from 'components/contract/placeholder_modal';

import {  PlusIcon  } from '@heroicons/react/outline'
import {t} from 'helper/translate'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';


@withTranslate
class ContractUpdate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_saving : false,
            show_upload_modal : false
        }
        this.formRef = React.createRef();
        this.submitForm = ::this.submitForm
    }

    componentDidMount() {
        if (this.props.contract) {
            this.setForm(this.props.contract)
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.contract && !this.props.contract.equals(prevProps.contract)) {
            this.setForm(this.props.contract)
        }
    }

    @autobind
    toggleModal(name) {
        this.setState({
            [name]: !this.state[name]
        })
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

    render() {
        // const {t} = this.props.i18n;
        const {is_saving} = this.state;
        const {club_id,club,contract} = this.props;

        let init_data = {
            placeholder_img_id: 0,
            placeholder_video_id: 0,
            wl_bluechip_list: "",   //
            wl_enable: 0,
            wl_price: "0",  //
            delay_reveal_enable : "0"
        }

        let formSchema = Yup.object().shape({
            name      : Yup.string().required(),
        });

        return  <Formik
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
                
                    <UploadPlaceholderModal club={club} visible={this.state.show_upload_modal} closeModal={this.toggleModal.bind({},'show_upload_modal')} setFieldValue={setFieldValue}/>


            


            </Form>
                )}
            </Formik>
    }
    
}


const mapDispatchToProps = (dispatch) => {
    return {
        saveContract : (data) => {
            return dispatch(saveContract(data))
        }
    }
}
function mapStateToProps(state,ownProps) {
}

export default connect(mapStateToProps,mapDispatchToProps)(ContractUpdate)
