import React from 'react';

import autobind from 'autobind-decorator';
import {withTranslate} from 'hocs/index'
import withLabel from 'hocs/label'
import classNames from 'classnames';

import {uploadRequest} from 'helper/http'
import Upload from 'components/common/upload'

import { UploadIcon } from '@heroicons/react/outline';
import message from 'components/common/message'

@withTranslate
@withLabel
class UploadWhiteListCsv extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    componentDidMount() {
    }

    @autobind
    handleUpload(value) {
        console.log('upload success',value);
        message.success(value.data.count + ' address uploaded');
        // this.setState({
        //     'upload_count' : value.data.count
        // })
        this.props.setFieldValue('whitelist_count',value.data.count)
    }

    render() {

        const {t} = this.props.i18n;
        const {upload_count} = this.state;
        const {value} = this.props;


        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/contract/whitelist_upload?club_id='+this.props.club_id,
            name : 'file',
            listType : 'picture',
            accept : '.csv',
        })
        return  <div className='flex justify-start items-center'>
            <Upload uploadProps={uploadProps} afterSuccess={this.handleUpload}>  
                <button type="button" className='btn btn-default'>
                    <UploadIcon className='w-4 mr-2' /> {t('upload csv file')}
                </button>
            </Upload>
            <div className={classNames("ml-8 font-ubuntu",{"text-green-500":(value>0)})}>
                {value} addresses
            </div>
        </div>

    }
}



module.exports = UploadWhiteListCsv
