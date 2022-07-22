import React from 'react';
import PropTypes from 'prop-types'
import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from 'components/common/modal';
import Button from 'components/common/button'
import Input from 'components/form/field'
import {confirm} from 'components/common/confirm/index'
import message from 'components/common/message'

import {httpRequest} from 'helper/http';
import autobind from 'autobind-decorator';

@withTranslate
class GenerateFrom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible : false
        }
        this.listRef = React.createRef();
        this.submitForm = ::this.submitForm
        this.generateNFT = ::this.generateNFT
    }

    async submitForm(values) {
        const {t} = this.props.i18n;
        if (await confirm({
            title : t('Generate NFT'),
            confirmation: t('are you sure you want to regenerate NFT images?')
        })) {
            this.generateNFT(values.collection_size)
        }
    }

    
    async generateNFT(collection_size) {
        
        const {club_id} = this.props;
        const {t} = this.props.i18n;

        this.setState({
            'is_fetching' :  true
        })
        
        let clear_msg_loader = message.loading(t('Generating NFT images...'));

        try {
            let result = await httpRequest({
                'url' : '/v1/image/generate/generate_all',
                'method' : 'POST',
                'data'  : {
                    'club_id'      : club_id,
                    'max_number'   : collection_size
                }
            })
        }catch(e) {
            console.log('debug00,result',e)
            if (e.status == 'error') {
                message.error(e.messages.join(','))
            }
        }

        clear_msg_loader();
        // console.log('debug08,result',result);

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true
        })

        if (typeof this.props.afterGenerate === 'function') {
            this.props.afterGenerate();
        }
    }

    @autobind
    toggleVisible() {
        this.setState({
            visible : !this.state.visible
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_fetching,visible} = this.state;


        let init_data ={
            'collection_size' : 5000,
        }

        let formSchema = Yup.object().shape({
            collection_size      : Yup.number().required(),
        });

        return <div>
            <button className='btn btn-primary' onClick={this.toggleVisible}>{t("generate")}</button>
            <Modal visible={visible} onClose={this.toggleVisible} >
                <h2 className='modal-title'>{t('generate')}</h2>

                <div className='border-t d-border-c-1 mb-4'></div>
                <Formik
                    innerRef={this.formRef}
                    initialValues={init_data}
                    validationSchema={formSchema}
                    onSubmit={this.submitForm}>
                    {({ errors, touched }) => (
                        
                        <Form>

                        <div className="">
                            <Input name="collection_size" label={t('collection size')} 
                                placeholder={t("how many NFT you wanna to generate")} />
                        </div>
                        <div className='flex justify-end'>
                            <Button loading={is_fetching} className="btn btn-default" type="submit">{t("generate")}</Button>
                        </div>
                    </Form>
                    )}
                </Formik>
            </Modal>
        </div>

    }
    
}

GenerateFrom.propTypes = {
    club_id           : PropTypes.number.isRequired,
};

export default GenerateFrom