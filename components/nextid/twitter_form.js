import React from 'react';

import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'
import notification from 'components/common/notification'
import Success from 'components/common/success'

import {withTranslate} from 'hocs/index'

import {
    TwitterShareButton
  } from "react-share";
  import TwitterIcon from 'public/img/share/twitter.svg'

import { sign } from "helper/nextid/keypair";
import NextId from 'helper/nextid'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import autobind from 'autobind-decorator';

import {createKeyPiar} from 'helper/nextid/keypair'


@withTranslate
class TwitterForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'show_validate_form'    : false,
            'step'                  : 'payload',
            'is_validating_twitter' : false,
            'is_validating_tweet'   : false,
            'payload'               : null,
            'identity'              : ''
        }
        this.bindingTwitter = ::this.bindingTwitter
        this.validateTwitter = ::this.validateTwitter
    }

    componentWillUnmount() {
        this.setState({
            'show_validate_form'    : false,
            'step'                  : 'payload',
            'is_validating_twitter' : false,
            'is_validating_tweet'   : false,
            'payload'               : null,
            'identity'              : ''
        })
    }

    async bindingTwitter(values) {

        const {club_id,persona} = this.props;
        //
        // let persona = createKeyPiar();

        console.log('bindingTwitter:now club_id:' + club_id);
        console.log('bindingTwitter:persona:',persona);

        this.setState({
            'is_validating_twitter' : true
        })

        // let public_key = persona.publicKey.toString('hex');
        let public_key = persona.public_key;
        console.log('bindingTwitter:public_key',public_key)

        let nextid = new NextId();
        let result = await nextid.proof_payload({
            'action'        : 'create',
            'platform'      : 'twitter',
            'identity'      : values.account_name,
            'public_key'    : public_key
        });
        console.log('bindingTwitter:result',result)

        ///需要一次账户签名，来确认是没问题的
        console.log('bindingTwitter:persona.private_key',persona.private_key)

        let person_sign = await sign(result.sign_payload, persona.private_key,true)

        this.setState({
            'is_validating_twitter' : false,
            'step'          : 'validate',
            'payload'       : result,
            'identity'      : values.account_name,
            'person_sign'   : person_sign
        })

    }

    async validateTwitter(values) {
        const {t} = this.props.i18n;
        const {address,persona} = this.props;
        const {identity,payload} = this.state;

       
        
        console.log('now login wallet:' + address);
        console.log('validateTwitter:' , values);

        this.setState({
            'is_validating_tweet' : true
        })


        let nextid = new NextId();

        let result2;
        try {
            result2 = await nextid.proof_create({
                'platform'      : 'twitter',
                'identity'      : identity,
                'public_key'    : persona.public_key,
                'proof_location': values.tweet_id,
                'uuid'          : payload.uuid,
                'created_at'    : payload.created_at,
            });
            this.setState({
                'is_validating_tweet'  : false,
                'step'      :   'success'
            })
    
        }catch(e) {
            notification.error({
                'message'     : t('bind error'),
                'description' : <div className='max-w-xs break-all'>{e.toString()}</div>,
            })
            this.setState({
                'is_validating_tweet'  : false,
            })
    
        }

    }

    @autobind
    showValidateForm() {
        this.setState({
            'show_validate_form' : true
        })
    }
 
    render() {
        const {t} = this.props.i18n;
        const {step,payload,person_sign,show_validate_form} = this.state;

        if (step == 'validate') {

            let formSchema = Yup.object().shape({
                tweet_id     : Yup.string().required(),
            });
    
            let init_data = {
                'tweet_id'           : '',
            }

            let tweet_text = payload.post_content.default.replace("%SIG_BASE64%",person_sign)

            return  <Formik
            innerRef={this.formRef}
            initialValues={init_data}
            validationSchema={formSchema}
            onSubmit={this.validateTwitter}>
            {({ errors, touched }) => (
                
                <Form className="w-full">
                
                <div className="p-4 md:p-6">

                    <div className='break-all p-4 border-2 border-violet-400 mb-4'>
                        {tweet_text}
                    </div>

                    <div className='flex justify-end'>
                    <TwitterShareButton title={''} url={tweet_text}>
                        <a className="btn btn-secondary whitespace-nowrap" onClick={this.showValidateForm}><TwitterIcon className="dropdown-icon mr-2 h-5 twitter-color" />{t('send tweet')}</a>
                    </TwitterShareButton>
                    </div>

                    {
                        (show_validate_form)
                        ? <div className='mt-4 pt-4 border-t border-gray-200'>
                            <PrefixInput prefix={"/status/"} name="tweet_id" label={t("tweet_id")} placeholder={t("tweet number id")} />

                            <div className='border-t border-gray-300 my-4' />
                            <div className="form-submit flex justify-end mt-4">
                                <Button loading={this.state.is_validating_tweet} className="btn btn-primary" type="submit">{t("submit")}</Button>
                            </div>
                        </div>
                        : null
                    }

                </div>

            </Form>
            )}
        </Formik>
        }else if (step == 'payload') {

            let formSchema = Yup.object().shape({
                account_name    : Yup.string().required(),
            });
    
            let init_data = {
                'account_name'           : '',
            }

            return  <Formik
                innerRef={this.formRef}
                initialValues={init_data}
                validationSchema={formSchema}
                onSubmit={this.bindingTwitter}>
                {({ errors, touched }) => (
                    
                    <Form className="w-full">
                    
                    <div className="p-4 md:p-6">
                        <PrefixInput prefix={"@"} name="account_name" label={t("twitter account name")} placeholder={t("account name without @")} />

                        <div className='border-t border-gray-300 my-4' />
                        <div className="form-submit flex justify-end mt-4">
                            <Button loading={this.state.is_validating_twitter} className="btn btn-primary" type="submit">{t("submit")}</Button>
                        </div>

                    </div>

                </Form>
                )}
            </Formik>
        }else if (step == 'success') {
            return <div>
                <Success text={t('bind twitter success')} />
            </div>
        }

    }

    
}

export default TwitterForm

