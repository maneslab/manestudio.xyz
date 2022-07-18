import React from 'react';

import autobind from 'autobind-decorator'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import IntergrationButton from 'components/form/mane/intergration_type_select';
import TextareaAutosize from 'react-textarea-autosize';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import config from 'helper/config';
import message from 'components/common/message'


@withTranslate
@withMustLogin
class ClubIntergration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_updating : false,
            type : "type1"
        }
    }

    @autobind
    setType(value) {
        this.setState({
            'type' : value
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {club} = this.props;
        const {type} = this.state;

        let space_url_base = config.get('SPACE_WEBSITE');
        let iframe_url = space_url_base + '/widget/' + club.get('id') + '?type=' + type;

        console.log('iframe_url',iframe_url);
        let str  = '<iframe src="'+iframe_url+'" allowtransparency="true" height="48" width="320"></iframe>'

        return  <div>
            <h2 className='h2 mb-2'>{t('integration mint button')}</h2>
            <div className='block-wapper-one mb-4'>
                <div className='l'>
                    <div className='form-box-one'>
                        <div className='max-w-xs'>
                        <IntergrationButton data_map={{
                            'type1' :  'type 1',
                            'type2' :  'type 2',
                            'type3' :  'type 3',
                            'type4' :  'type 4'
                        }} value={this.state.type} onChange={this.setType} label={t('type')} />
                        </div>
                        <div className=''>
                            <label className="label"><span className="label-text">{t('preview')}</span></label>
                            <div className='bg-gray-50 dark:bg-gray-900 py-12 flex  justify-center'>
                                <iframe src={iframe_url} allowtransparency="true" height={48} width={320}></iframe>
                            </div>
                        </div>
                        <div className=''>
                            <label className="label"><span className="label-text">{t('button code')}</span></label>
                            <div className=''>
                                <TextareaAutosize className='input-box' value={str}>
                                </TextareaAutosize>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <CopyToClipboard text={str}
                                onCopy={() => {
                                    message.success('copy successful');
                                }}>
                                <a className="btn btn-default">{t('copy')}</a>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
                <div className='r'>
                    <div className='block-intro'>
                        <h3>{t('drop details')}</h3>
                        <div className='ct'>
                            <p>{t('Add the general title of the your collection drop, write some description and tell us the story behind your artworks.')}</p>
                        </div>
                    </div>
                </div>
                
            </div>
                <div className='block-wapper-one'>
                    <div className='l'>
                    </div>
                    <div className='r'>
                    </div>
                </div>

        </div>

    }
    
}


export default ClubIntergration
