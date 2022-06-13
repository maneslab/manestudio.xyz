import React from 'react';


import Modal from 'components/common/modal'
import Button from 'components/common/button'

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
            'step'                  : 'init',
            'is_validating_wallet'  : false,
            'is_validating_twitter' : false,
            'is_fetching_person'    : false,
            'persona'               : null,
        }
        this.getPersona = ::this.getPersona
    }

    componentDidMount() {
        this.getPersona();
        let key_pair = createKeyPiar();
        console.log('key_pair_public',key_pair.publicKey.toString('hex'));
        console.log('key_pair_private',key_pair.privateKey.toString('hex'));

    }

    componentDidUpdate(prevProps) {
        if (!this.props.visible && prevProps.visible) {
            this.setState({
                'step'                  : 'init',
                'is_validating_wallet'  : false,
                'is_validating_twitter' : false,
            })
        }   
    }


    async getPersona() {    
        const {club_id} = this.props;

        this.setState({
            'is_fetching_person' : true
        })
        // let sign_payload = 'validate_wallet:'+address+',hex_random_hash:'+this.GetRandomNum(1000000000,99999999999);        
        // const signature = await ethereum.request({ method: 'personal_sign', params: [ sign_payload, address ] });

        let result = await httpRequest({
            'url'    : '/v1/club/key',
            'method' : 'GET', 
            'data'   : {
                id : club_id
            }
        })

        if (result.status != 'success') {
            this.setState({
                'is_fetching_person' : false
            })
            throw Error('request person error');
        }
        this.setState({
            'is_fetching_person' : false,
            'step'               : 'fetched_person',
            'persona' : {
                'data'    : result.data,
                'club_id' : club_id
            }
        })

        return  {
            'data'    : result.data,
            'club_id' : club_id
        };
    }


   

    render() {
        const {visible,club_id} = this.props;
        const {t} = this.props.i18n;
        const {step,is_validating_wallet,is_fetching_person,persona} = this.state;

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <div className='modal-title'>{t('bind twitter')}</div>

                    <div className=''>
                        {
                            (step == 'init')
                            ? <div className='flex justify-center items-center py-12'>
                                <Button loading={is_fetching_person} className='btn btn-primary' onClick={this.getPersona}>{t('validate wallet')}</Button>
                            </div>
                            :null
                        }
                        {
                            (step == 'fetched_person')
                            ? <div className='flex justify-center items-center'>
                                <TwitterForm persona={(persona && persona.club_id == club_id)?persona.data:null} club_id={club_id} />
                            </div>
                            :null
                        }

                    </div>
                    
                </Modal>
    }

    
}



export default BindingModal

