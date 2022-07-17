import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import Modal from 'components/common/modal'
import Button from 'components/common/button'
import Input from 'components/form/field'
import PrefixInput from 'components/form/prefix_input'
import FormObserver from 'components/form/observer';

import ProjectTypeSelect from 'components/form/mane/project_type_select'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {addClub} from 'redux/reducer/club'

import {withTranslate} from 'hocs/index'

import { withRouter } from 'next/router';

import withWallet from 'hocs/wallet';
import autobind from 'autobind-decorator';


@withRouter
@withWallet
@withTranslate
class ClubCreateModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_adding : false,
            project_type : 'use_generator'
        }
    }

    @autobind
    submitForm(values) {
        console.log('debug03,values',values)

        this.setState({
            'is_adding' : true
        });

        var that = this;
        this.props.addClub(values).then(data=>{
            console.log('result',data);
            if (data.status == 'success') {
                that.setState({
                    'is_adding' : false
                })
                ///URL跳转
                this.props.router.push('/project/'+data.data.id+'/group');
            }else {
                Object.keys(data.messages).map(key=>{
                    this.formRef.current.setFieldError(key,data.messages[key].join(','));
                })
            }
        }).catch(error=>{
            that.setState({
                'is_adding' : false
            })
        })
    }

    @autobind
    formChange(values) {
        console.log('formChange',values)
        this.setState({
            'project_type' : values.project_type
        })
    }
    

    render() {
        const {project_type,is_adding} = this.state;
        const {visible,deposit_data} = this.props;
        const {t} = this.props.i18n;

        if (!visible) {
            return null;
        }

        console.log('deposit_data',deposit_data)

        let init_data ={
            'name' : '',
            'project_type' : 'use_generator',
            'height' : 1200,
            'width'  : 1200
        }

        let formSchema;
        if (project_type == 'use_generator') {
            formSchema = Yup.object().shape({
                name      : Yup.string().required(),
                project_type : Yup.string().required(),
                width       :  Yup.number().min(512).max(2048).required(),
                height      :  Yup.number().min(512).max(2048).required(),
            });
        }else {
            formSchema = Yup.object().shape({
                name      : Yup.string().required(),
                project_type : Yup.string().required(),
            });
        }

        

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <h2 className='modal-title'>{t('create project')}</h2>
                  
                    <div>

                    <Formik
                        innerRef={this.formRef}
                        initialValues={init_data}
                        validationSchema={formSchema}
                        onSubmit={this.submitForm}>
                        {({ errors, touched }) => (
                            
                            <Form className="w-full">
                            
                            <FormObserver onChange={this.formChange}/>

                            <div className="p-0">

                                <Input name="name" label={t("project name")} placeholder={t("any name you want")} />

                                <ProjectTypeSelect name="project_type" label={t("project type")} />

                                {
                                    (this.state.project_type == 'use_generator')
                                    ? <div className='grid grid-cols-2 gap-4'>
                                        <PrefixInput name="width" label={t("width")} placeholder={t("width")} endfix={'px'} />
                                        <PrefixInput name="height" label={t("height")} placeholder={t("height")} endfix={'px'} />
                                    </div>
                                    : null
                                }

                                <div className='border-t d-border-c-1 my-4' />

                                <div className="form-submit flex justify-end mt-4">
                                    <Button loading={is_adding} className="btn btn-primary" type="submit">{t("create project")}</Button>
                                </div>

                            </div>

                        </Form>
                        )}
                    </Formik>


                    </div>

                    
                </Modal>
    }

    
}
ClubCreateModal.propTypes = {
    visible     : PropTypes.bool,
    closeModal  : PropTypes.func,
};
  

function mapStateToProps(state,ownProps) {
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        addClub   : (cond) => {
            return dispatch(addClub(cond))
        },
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(ClubCreateModal)


