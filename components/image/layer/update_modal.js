import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import autobind from 'autobind-decorator';

import Modal from 'components/common/modal'
import Button from 'components/common/button'
import Input from 'components/form/field'
import Slider from 'components/form/slider'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {updateLayer} from 'redux/reducer/image/layer'
import {withTranslate} from 'hocs/index'


@withTranslate
class LayerUpdateModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_adding : false,
        }
    }

    @autobind
    submitForm(values) {
        console.log('debug03,values',values)

        this.setState({
            'is_adding' : true
        });

        let id  = this.props.item.get('id')

        var that = this;
        this.props.updateLayer(id,values).then(data=>{
            console.log('result',data);
            if (data.status == 'success') {
                that.setState({
                    'is_adding' : false
                })
                ///URL跳转
                // this.props.refreshList();
                this.props.closeModal();
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
    

    render() {
        const {is_adding} = this.state;
        const {item} = this.props;
        const {t} = this.props.i18n;

        if (!item) {
            return null;
        }

        let init_data ={
            'name' : item.get('name'),
        }

        const formSchema = Yup.object().shape({
            name      : Yup.string().required(),
        });
        let notice = <div class="alert alert-warning my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{t('warning')}: {t("layer-info")}</span>
        </div>
      </div>
        return  <Modal
                    width={650}
                    title={null}
                    visible={item?true:false} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <h2 className='modal-title'>{t('edit layer')}</h2>
                  
                    <div>

                    <Formik
                        innerRef={this.formRef}
                        initialValues={init_data}
                        validationSchema={formSchema}
                        onSubmit={this.submitForm}>
                        {({ errors, touched }) => (
                            
                            <Form className="w-full">
                            

                            <div className="p-0">

                                <Input name="name" onlyLayer={true} label={t("layer name")} placeholder={t("any name you want")} notice={notice} />

                                <div className='border-t d-border-c-1 my-4' />

                                <div className="form-submit flex justify-end mt-4">
                                    <Button loading={is_adding} className="btn btn-primary" type="submit">{t("update layer")}</Button>
                                </div>

                            </div>

                        </Form>
                        )}
                    </Formik>


                    </div>

                    
                </Modal>
    }

    
}


function mapStateToProps(state,ownProps) {
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateLayer   : (id,cond) => {
            return dispatch(updateLayer(id,cond))
        },
    }
}

LayerUpdateModal.propTypes = {
    item     : PropTypes.object.isRequired,
    closeModal  : PropTypes.func.isRequired,
};
  

module.exports = connect(mapStateToProps,mapDispatchToProps)(LayerUpdateModal)


