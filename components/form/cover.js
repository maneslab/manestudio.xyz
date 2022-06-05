import React from 'react';

import Button from 'components/common/button'
// import Loading from 'components/common/loading'
import Upload from 'components/common/upload'

import {uploadRequest} from 'helper/http'
import {withTranslate} from 'hocs/index'


@withTranslate
class FormCover extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        const {afterSuccess,img_url} = this.props;
        const {t} = this.props.i18n;
        
        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=cover',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })


        return (
            <div className="mb-12">
                <div className="w-full text-center py-4">
                    <img src={img_url} className="h-36"/>
                </div>
                <div className="w-full text-center px-12">
                <Upload uploadProps={uploadProps} afterSuccess={afterSuccess}>
                    <a className="btn btn-primary">
                        upload image
                    </a>
                    <p className="text-sm text-gray-400 mt-2">{"minimum image size is 1024*200 pixels"}</p>
                </Upload>
                </div>
            </div>
        )
    }
    
}

module.exports = FormCover
