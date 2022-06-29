import React from 'react';
import PropTypes from 'prop-types';
import  Immutable from 'immutable'

import autobind from 'autobind-decorator';

import Modal from 'components/common/modal'
// import Loading from 'components/common/loading'
import Button from 'components/common/button'


import {withTranslate} from 'hocs/index'
import {httpRequest} from 'helper/http'
import GenerateImage from 'components/image/generate/image2'

import {percentDecimal} from 'helper/number'
// import { TrashIcon } from '@heroicons/react/outline';

@withTranslate
class ImageModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            data        : {}
        }
        this.regenerate = ::this.regenerate
    }

    componentDidMount() {
        if (this.props.id) {
            this.fetchTraits(this.props.id);
        }
    }
    

    componentDidUpdate(prevProps,prevState) {
        if (this.props.id && this.props.id != prevProps.id) {
            this.fetchTraits(this.props.id);
        }
    }

    @autobind
    async fetchTraits(id){

        this.setState({
            'is_fetching' : true
        })

        let result = await httpRequest({
            'url' : '/v1/image/generate/stat',
            'method' : 'GET',
            'data'  : {
                'id'      : id,
            }
        })
        console.log('debug01,result',result);

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'data'        : result.data
        })

    }

    async regenerate(){

        const {id,index} = this.props;

        this.setState({
            'is_fetching' :  true
        })

        let result = await httpRequest({
            'url' : '/v1/image/generate/regenerate',
            'method' : 'POST',
            'data'  : {
                'id'      : id,
            }
        })
        console.log('debug01,result',result);

        this.setState({
            'is_fetching'   :  false,
            'is_fetched'    : true,
            'data'          : result.data
        })

        this.props.handleChangeImage(index,result.data.generate)

    }
    render() {
        const {is_fetched,is_fetching,data} = this.state;
        const {visible,list_count} = this.props;
        const {t} = this.props.i18n;

        if (!visible) {
            return null;
        }
        console.log('data',data)
        const {trait_stat,generate} = data;
//                        <a className='btn btn-outline btn-block mt-4' target="_blank" href={generate.image_url}>{t('download')}</a>

        return  <Modal
            width={900}
            title={null}
            visible={visible} 
            footer={null}
            onClose={this.props.closeModal}>

            {
                (is_fetched)
                ?   <div>
                <div className='flex justify-start'>
                    <div className='w-96 mr-8'>
                        <GenerateImage trait_list={Immutable.fromJS(trait_stat)} is_fetching={is_fetching}/>

                    </div>
                    <div className='flex-grow flex flex-col justify-between'>
                        
                        <div>
                            <h2 className='modal-title border-b border-gray-200 pb-4'>{t('preview')} # {generate.temp_id}</h2>

                            <h3 className='mb-2 text-sm'>{t('properties')}</h3>
                            <div className='grid grid-cols-3 gap-2'>
                                {
                                    Object.keys(trait_stat).map(k=>{
                                        return <div className='border border-gray-200 p-2 text-center'>
                                            <div className='text-gray-500 text-sm font-ubuntu'>{trait_stat[k]['layer']['name']}</div>
                                            <div className="text-black font-bold font-ubuntu">{trait_stat[k]['name']}</div>
                                            <div className='text-xs text-gray-500'>
                                                {percentDecimal(trait_stat[k]['prob'])}%
                                                have this
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                <span className='mr-1'>{trait_stat[k]['occurence_count']}</span>
                                                total
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                        <div className='pt-4 flex justify-end'>
                            <Button className="btn btn-primary" loading={is_fetching} onClick={this.regenerate}>{t('regenarate')}</Button>
                        </div>

                    </div>
                </div>

                </div>
                : null
            }
            
        </Modal>
    }

    
}


ImageModal.propTypes = {
    // visible     : PropTypes.bool.isRequired,
    // closeModal  : PropTypes.func.isRequired,
    // refreshList : PropTypes.func.isRequired,
    // club_id     : PropTypes.number.isRequired,
    // list_count  : PropTypes.number.isRequired
};
  
module.exports = ImageModal


