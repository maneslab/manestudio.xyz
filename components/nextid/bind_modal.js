import React from 'react';

import autobind from 'autobind-decorator';
import Modal from 'components/common/modal'
import Loading from 'components/common/loading'

import {withTranslate} from 'hocs/index'
import TwitterForm from 'components/nextid/twitter_form'

import { createKeyPiar, sign,base64Sign } from "helper/nextid/keypair";
import NextId from 'helper/nextid';
import { randomBytes } from 'crypto';
import { httpRequest } from 'helper/http';

// import {getConfig} from 'helper/config'
// import worker from 'helper/worker'
// import message from 'components/common/message'

@withTranslate
class BindingModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'step'                  : 'payload',
        }
    }


    componentDidUpdate(prevProps) {
        if (!this.props.visible && prevProps.visible) {
            this.setState({
                'step'                  : 'payload',
            })
        }   
    }

    @autobind
    handleStepChange(step) {
        this.setState({
            'step' : step
        })
    }

   

    render() {
        const {visible,club_id,key_data} = this.props;
        const {t} = this.props.i18n;
        const {step} = this.state;

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <div className='modal-title'>{t('bind twitter')}</div>

                    <div className=''>
                        {
                            (key_data && key_data.get('is_fetching'))
                            ? <div className='flex justify-center items-center py-12'>
                                <Loading />
                            </div>
                            :null
                        }
                        {
                            (key_data && key_data.getIn(['data','public_key']))
                            ? <div className='flex justify-center items-center'>
                                <TwitterForm persona={key_data.get('data')} club_id={club_id} step={step} handleStepChange={this.handleStepChange} refreshList={this.props.refreshList}/>
                            </div>
                            :null
                        }
                    </div>
                    
                </Modal>
    }

    
}



export default BindingModal

