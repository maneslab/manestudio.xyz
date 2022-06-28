import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import Modal from 'components/common/modal'

import {withTranslate} from 'hocs/index'
import {PhotographIcon, FilmIcon} from '@heroicons/react/outline'
import Upload from 'components/common/upload'
import {uploadRequest,getUploadImageUrl} from 'helper/http'

@withTranslate
class PlaceholderModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    @autobind
    handleUploadImageSuccess(result) {
        console.log('upload-result',result)

        // this.props.saveContract({
        //     'placeholder_img_id'    : result.data.img_id,
        //     'club_id'               : this.props.club.get('id')
        // });

        this.props.setFieldValue('placeholder_img',result.data)

        this.props.closeModal();
    }

    render() {

        const {t} = this.props.i18n;

        const uploadImageProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: getUploadImageUrl(this.props.club),
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        return <Modal
            width={650}
            title={null}
            visible={this.props.visible} 
            footer={null}
            onClose={this.props.closeModal}>

            <h2 className='modal-title'>{t('upload pre-reveal placeholder')}</h2>
                                            
            <div className='divider' />
            <div className='upload-placeholder'>
                <Upload uploadProps={uploadImageProps} afterSuccess={this.handleUploadImageSuccess}>
                <button className="btn btn-outline ">
                    <div className="flex justify-start capitalize">
                        <PhotographIcon className='icon-sm mr-2'/>
                        <span>{t('choose image file')}</span>
                    </div>
                    <div className='text-gray-400 text-sm'>
                        jpg / png / gif
                    </div>
                </button>
                </Upload>
                <button className="btn btn-outline">
                    <div className="flex justify-start capitalize">
                        <FilmIcon className='icon-sm mr-2'/>
                        <span>{t('choose video file')}</span>
                    </div>
                    <div className='text-gray-400 text-sm'>
                        mp4
                    </div>
                </button>
            </div>
        </Modal>
    }

    
}
PlaceholderModal.propTypes = {
    visible     : PropTypes.bool,
    closeModal  : PropTypes.func,
};
  



module.exports = PlaceholderModal


