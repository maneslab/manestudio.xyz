import React from 'react';
import autobind from 'autobind-decorator'
// import Button from 'components/common/button'
import Upload from 'components/common/upload'
import Avatar from 'components/avatar/one'
import NftAvatar from 'components/avatar/nft';

import {uploadRequest} from 'helper/http'
import {withTranslate} from 'hocs/index'


@withTranslate
class FormAvatar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    @autobind
    setNftAvatar(nft_avatar) {
        if (this.props.handleSetNft) {
            this.props.handleSetNft({
                'nft_token_id'  : nft_avatar.get('token_id'),
                'nft_contract_address' : nft_avatar.getIn(['contract_address'])
            });
        }
    }

    render() {

        const {handleUpload,avatar} = this.props;
        let {default_avatar} = this.props;
        const {t} = this.props.i18n;

        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=avatar',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        // console.log('debug-avatar',avatar);
        // if (avatar) {
        //     console.log('debug-avatar',avatar.toJS());
        // }

        if (!default_avatar) {
            default_avatar = "/img/common/club_avatar.png";
        }

        return (
            <div className="mb-12">
                <div className="w-full flex justify-center py-4">
                    <Avatar avatar={avatar} default_avatar={default_avatar} size={36} className="mx-auto"/>
                </div>
                <div className="w-full justify-center px-12 flex space-x-4">
                    <Upload uploadProps={uploadProps} afterSuccess={handleUpload}>
                        <a className="btn btn-default">
                            {t("upload image")}
                        </a>
                    </Upload>
                    {
                        (this.props.handleSetNft)
                        ? <NftAvatar handleFinish={this.setNftAvatar}/>
                        : null
                    }
                </div>
            </div>
        )
    }
    
}

module.exports = FormAvatar
