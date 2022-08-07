import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/common/modal'
import Button from 'components/common/button'

import {withTranslate} from 'hocs/index'

import autobind from 'autobind-decorator';
import message from 'components/common/message'

@withTranslate
class DestroyModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value : ""
        }
    }

    @autobind
    destroy() {
        const {t} = this.props.i18n;

        if (this.state.value == 'DESTROY') {
            this.props.handleDestroy();
        }else {
            message.error(t('destroy-info-2'));
        }
    }

    render() {
        const {value} = this.state;
        const {visible} = this.props;
        const {t} = this.props.i18n;

        if (!visible) {
            return null;
        }


        return  <Modal
            width={650}
            title={null}
            visible={visible} 
            footer={null}
            onClose={this.props.closeModal}>

            <h2 className='modal-title'>{t('destroy contract')}</h2>

            <div className='border-t border-gray-100 my-4' />
            <div className='mb-4'>
                {t('destory-info')}
            </div>


            <div className='mb-4'>
                {t('destroy-info-2')}
            </div>

            <div className='mb-4'>
                <input value={value} onChange={(e)=>{
                    this.setState({
                        'value' : e.target.value
                    })
                }} className='input-box' placeholder={t('destroy-info-2')}/>
            </div>

            <div className='flex justify-end'>
                <Button loading={this.props.is_destroy_contract} className='btn btn-error' onClick={this.destroy}>{t('Destroy-btn-text')}</Button>
            </div>

        </Modal>
    }

    
}
DestroyModal.propTypes = {
    visible     : PropTypes.bool,
    closeModal  : PropTypes.func,
};
  


module.exports = DestroyModal


