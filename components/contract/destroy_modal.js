import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/common/modal'
import Button from 'components/common/button'

import {withTranslate} from 'hocs/index'

import autobind from 'autobind-decorator';
import message from 'components/common/message'

@withTranslate
class DestoryModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value : ""
        }
    }

    @autobind
    destory() {
        if (this.state.value == 'destroy') {
            this.props.handleDestroy();
        }else {
            message.error('please input destroy to confirm destory');
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

            <h2 className='modal-title'>{t('destory')}</h2>

            <div className='border-t border-gray-100 my-4' />
            <div className='mb-4'>
                {t('destory-info')}
            </div>


            <div className='mb-4'>
                {t('Please type  "destory"  to confirm')}
            </div>

            <div className='mb-4'>
                <input value={value} onChange={(e)=>{
                    this.setState({
                        'value' : e.target.value
                    })
                }} className='input-box' placeholder={t('Please type  "destory"  to confirm')}/>
            </div>

            <div className='flex justify-end'>
                <Button loading={this.props.is_destroy_contract} className='btn btn-error' onClick={this.destory}>{t('destory')}</Button>
            </div>

        </Modal>
    }

    
}
DestoryModal.propTypes = {
    visible     : PropTypes.bool,
    closeModal  : PropTypes.func,
};
  


module.exports = DestoryModal


