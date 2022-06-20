import React from 'react';

import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'
import {confirm} from 'components/common/confirm/index'


@withTranslate
class GenerateFrom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.listRef = React.createRef();
        this.submitForm = ::this.submitForm
    }

    async submitForm() {
        const {t} = this.props.i18n;

        if (await confirm({
            title : t('Generate NFT'),
            confirmation: t('are you sure you want to regenerate NFT images?')
        })) {
        }
    }

    render() {
        const {t} = this.props.i18n;
        const {is_adding} = this.state;


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
                        <Button loading={is_adding} className="btn btn-default" type="submit">{t("generate")}</Button>
                    </div>

                </Form>
                )}
            </Formik>
    }
    
}

export default GenerateFrom
