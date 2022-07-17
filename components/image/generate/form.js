import React from 'react';
import PropTypes from 'prop-types'
import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'
import {confirm} from 'components/common/confirm/index'
import message from 'components/common/message'

import {httpRequest} from 'helper/http';

@withTranslate
class GenerateFrom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
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


    render() {
        const {t} = this.props.i18n;
        const {is_fetching} = this.state;


        let init_data ={
            'collection_size' : 5000,
        }

        let formSchema = Yup.object().shape({
            collection_size      : Yup.number().required(),
        });

        return <Formik
                innerRef={this.formRef}
                initialValues={init_data}
                validationSchema={formSchema}
                onSubmit={this.submitForm}>
                {({ errors, touched }) => (
                    
                    <Form className="inline-form">

                    <div className="flex justify-start items-center ">
                        <PrefixInput name="collection_size" prefix={'collection size'} label={null} placeholder={t("how many NFT you wanna to generate")} className="mr-2" />
                        <Button loading={is_fetching} className="btn btn-default" type="submit">{t("generate")}</Button>
                    </div>

                </Form>
                )}
            </Formik>
    }
    
}

GenerateFrom.propTypes = {
    club_id           : PropTypes.number.isRequired,
};

export default GenerateFrom