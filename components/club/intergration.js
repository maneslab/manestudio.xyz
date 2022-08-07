import React from 'react';

import autobind from 'autobind-decorator'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import IntergrationButton from 'components/form/mane/intergration_type_select';
import TextareaAutosize from 'react-textarea-autosize';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import config from 'helper/config';
import message from 'components/common/message'

import Switch from 'rc-switch'


@withTranslate
@withMustLogin
class ClubIntergration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_updating : false,
            is_show : false,
            type : "type1"
        }
    }

    @autobind
    setType(value) {
        this.setState({
            'type' : value
        })
    }

    @autobind
    switchOnChange() {
        this.setState({
            'is_show' : !this.state.is_show
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {club} = this.props;
        const {type,is_show} = this.state;

        let space_url_base = config.get('SPACE_WEBSITE');
        let iframe_url = space_url_base + '/widget/' + club.get('id') + '?type=' + type;

        console.log('iframe_url',iframe_url);
        let str  = '<iframe src="'+iframe_url+'" allowtransparency="true" height="48" width="320"></iframe>'

        return  <div>
            <div className='flex flex-start items-center mb-2' >
                <h2 className='h2 mr-4'>{t('Embed Mint Button')}</h2>
                <Switch
                    onChange={this.switchOnChange}
                    disabled={false}
                    checked={is_show}
                    // checkedChildren="开"
                    // unCheckedChildren="关"
                />
            </div>
            {
                (is_show)
                ?   <div className='block-wapper-one mb-4'>
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
                                <label className="label"><span className="label-text">{t('Iframe Code')}</span></label>
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
                            <div className='ct'>
                                <p>{t('embed-mint-intro')}</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                : null
            }

        </div>

    }
    
}


export default ClubIntergration

