import React from 'react';


import Modal from 'components/common/modal'
import Button from 'components/common/button'
import Success from 'components/common/success'

import {withTranslate} from 'hocs/index'
import { sign } from "helper/nextid/keypair";
import NextId from 'helper/nextid';

import worker from 'helper/worker'

@withTranslate
class BindingModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'step'                  : 'init',
            'is_validating_wallet'  : false,
            'is_validating_twitter' : false,
            'is_fetching_person'    : false,
            'persona'               : null
        }
        this.unbind = ::this.unbind
        this.getPersona = ::this.getPersona
    }

    componentDidUpdate(prevProps) {
        if (!this.props.visible && prevProps.visible) {
            this.setState({
                'step'                  : 'init',
                'is_validating_wallet'  : false,
                'is_validating_twitter' : false,
                'is_fetching_person'    : false
            })
        }   
    }

    GetRandomNum(Min,Max)
    {
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    }

    async getPersona() {    
        const {address} = this.props;
        let sign_payload = 'validate_wallet:'+address+',hex_random_hash:'+this.GetRandomNum(1000000000,99999999999);
       
        this.setState({
            'is_fetching_person' : true
        })
        
        const signature = await ethereum.request({ method: 'personal_sign', params: [ sign_payload, address ] });

        let worker_interface = new worker();
        const person_result = await worker_interface.person({
            'sign_data' : sign_payload,
            'signature' : signature,
            'address'   : address
        });

        if (person_result.status != 'success') {
            this.setState({
                'is_fetching_person' : false
            })
            throw Error('request person error');
        }
        this.setState({
            'is_fetching_person' : false,
            'step' : 'fetched_person',
            'persona' : {
                'data'    : person_result.data,
                'address' : address
            }
        })
        return  {
            'data'    : person_result.data,
            'address' : address
        };
    }


    async unbind() {

        const {address,proof} = this.props;
        const {persona} = this.state;

        if (!persona) {
            return;
        }
        
        this.setState({
            'is_validating_wallet' : true
        })

        console.log('debug02,persona',persona)
        // try {

            let nextid = new NextId();
            let result = await nextid.proof_payload({
                'action'        : 'delete',
                'platform'      : 'twitter',
                'identity'      : proof.get('identity'),
                'public_key'    : persona.data.public_key
            });
            console.log('debug02,result',result)
            console.log('debug02,result2',{
                'action'        : 'delete',
                'platform'      : 'twitter',
                'identity'      : proof.get('identity'),
                'public_key'    : persona.data.public_key,
                'extra'         : {
                    'signature'  : await sign(result.sign_payload, persona.data.private_key,true )
                },
                'uuid'          : result.uuid,
                'created_at'    : result.created_at
            })

            let result2 = await nextid.proof_delete({
                'action'        : 'delete',
                'platform'      : 'twitter',
                'identity'      : proof.get('identity'),
                'public_key'    : persona.data.public_key,
                'extra'         : {
                    'signature'  : await sign(result.sign_payload, persona.data.private_key,true )
                },
                'uuid'          : result.uuid,
                'created_at'    : result.created_at
            });

            this.setState({
                'is_validating_wallet' : false,
                'step'                 : 'success'
            })

        // }catch(e) {
        //     message.error(e.message);
        //     this.setState({
        //         'is_validating_wallet' : false,
        //     })
        // }

    }

   

    render() {
        const {visible,proof} = this.props;
        const {t} = this.props.i18n;
        const {step,is_validating_wallet,is_fetching_person} = this.state;
        // let persona = this.getPersona();

        if (proof) {
            console.log('proof',proof.toJS());
        }
        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <h2 className='h2 text-center mb-4'>{t('unbind twitter')}</h2>

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
                            ? <div className='flex justify-center items-center py-12'>
                                <Button loading={is_validating_wallet} className='btn btn-primary' onClick={this.unbind}>{t('confirm unbind twitter')}</Button>
                            </div>
                            :null
                        }
                        {
                            (step == 'success')
                            ? <div className='flex justify-center items-center'>
                                <Success text={t('unbind twitter success')} />
                            </div>
                            :null
                        }

                    </div>
                    
                </Modal>
    }

    
}



export default BindingModal

