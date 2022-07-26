import React from 'react';
import autobind from 'autobind-decorator'

import {XCircleIcon} from '@heroicons/react/outline'
import classNames from 'classnames'
import Upload from 'rc-upload'

import message from 'components/common/message'
import withTranslate from 'hocs/translate';

@withTranslate
class UploadComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'file_list' : {},
        }
        this.uploadRef = React.createRef();

        this.destroy_gap_time = 200;    //单位ms,在这个时间以后会销毁这个进度block 
        this.message_show_time = 1000;  //单位ms,在这个时间以后成功消息展示完成以后会自动进入销毁的下一步
    }

    @autobind
    setBeginUpload(file) {

        const {file_list} = this.state;
        file_list[file.uid] = {
            file : file,
            is_uploading    : true,     //是否开始上传
            is_success      : false,    //表示是否成功
            is_error        : false,    //表示是否失败
            is_finished     : false,    //表示是否完成
            is_abort        : false,    //表示是否放弃上传
            upload_progress : 0,        //上传进度
        }

        this.setState({
            file_list
        })
    } 

    @autobind
    setProgress(file,value) {

        const {file_list} = this.state;
        file_list[file.uid]['upload_progress'] = value

        this.setState({
            file_list
        })
    } 


    // @autobind
    // setUploadFinish(file,value) {
    //     const {file_list} = this.state;
    //     file_list[file.uid]['is_uploaded'] = true

    //     this.setState({
    //         file_list
    //     })
    // } 

    @autobind
    reset() {
        this.setState({
            'file_list' : {}
        })
    }

    @autobind
    destroyWithGapTime(file) {
        setTimeout(() => {
            this.destroy(file)
        },this.message_show_time)
    }

    @autobind
    abort(file) {

        this.uploadRef.current.abort(file);

        const {file_list} = this.state;
        file_list[file.uid]['is_abort']     = true;
        file_list[file.uid]['is_uploading']    = false;
        this.setState({
            file_list
        });

        this.destroyWithGapTime(file);
    }

    @autobind
    beforeDestroy(file) {
        const {file_list} = this.state;
        file_list[file.uid]['is_finished']  = true;
        this.setState({
            file_list
        });
    }

    @autobind
    destroy(file) {
        this.beforeDestroy(file);
        setTimeout(()=>{
            this.afterDestroy(file);
        },this.destroy_gap_time);
    }

    @autobind
    afterDestroy(file) {
        const {file_list} = this.state;
        delete file_list[file.uid]
        this.setState({
            file_list
        })
    }
 
    @autobind
    uploadSuccess(response,file) {

        console.log('debug07,uploadSuccess',response,file)

        if (typeof this.props.afterSuccess == 'function') {
            this.props.afterSuccess(response,file);
        }

        // message.success(`${file.name} file uploaded successfully`);

        const {file_list} = this.state;
        file_list[file.uid]['is_success'] = true
        file_list[file.uid]['is_uploading'] = false

        this.setState({
            file_list
        })

        this.destroyWithGapTime(file);


    }


    @autobind 
    uploadError(err,body,file) {

        if (body.errors && body.errors.file) {
            for (var i in body.errors.file) {
                message.error(body.errors.file[i]);
            }
        }else {
            if (body.status == 'error') {
                for (var i in body.messages.file) {
                    message.error(body.messages.file[i]);
                }
            }else {
                message.error(`${file.name} file uploaded failed: error `+err['status']);
            }
        }

        const {file_list} = this.state;
        file_list[file.uid]['is_error']     = true;
        file_list[file.uid]['is_uploading']    = false

        this.setState({
            file_list
        })

        this.destroyWithGapTime(file);

    }


    render() {
        const {uploadProps} = this.props;
        const {file_list} = this.state;
        const {t} = this.props.i18n;

        const {setBeginUpload,setProgress,uploadSuccess,uploadError} = this;

        const newUploadProps = Object.assign(uploadProps,{
            beforeUpload(file) {
                console.log('debug07,->准备上传文件', file);
            },
            onStart: file => {
                console.log('debug07,->开始上传', file);
                setBeginUpload(file);
            },
            onSuccess(response,file) {
                console.log('debug07,->上传成功', response,file);
                uploadSuccess(response,file)
            },
            onProgress(step, file) {
                console.log('debug07,->上传进度',step,file);
                setProgress(file,Math.round(step.percent));
            },
            onError(err,body,file) {
                uploadError(err,body,file);
            },
        })

        /*<div className='flex justify-between items-center'>
                    <div className='flex-grow mr-4'>
                        <div className="flex justify-between mb-1 items-center">
                            <span className="text-base font-medium text-blue-700 dark:text-white text-xs h-4 w-24 text-ellipsis overflow-hidden">{file?file.name:"uploading"}</span>
                            <span className="text-sm font-medium text-blue-700 dark:text-white">{upload_progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{'width':upload_progress+"%"}}></div>
                        </div>
                    </div>
                    <div><a className="cursor-pointer a" onClick={(event)=>{
                        this.abort();
                        event.stopPropagation();
                        return false;
                    }}><XCircleIcon className="w-6 h-6"/></a></div>
                </div> */

                /*
                    <div>is_uploaded:{one.is_uploaded}</div>
                    <div>is_error:{one.is_error}</div>
                    <div>is_begin_upload:{one.is_begin_upload}</div>
                 */
        return <div>
        <Upload ref={this.uploadRef} {...newUploadProps}>
            {this.props.children}
        </Upload>
        <div className='fixed right-0 bottom-0 p-4 z-100'>
            {
                Object.keys(file_list).map(k=>{
                    const one = file_list[k];
                    console.log('debug-one',one)
                    return <div key={one.file.uid} className={classNames("block-upload-msg shadow-lg mb-2",
                        {"msg-success":one.is_success},
                        {"msg-error":(one.is_error || one.is_abort)},
                        {"msg-info":one.is_uploading},
                        {"rc-notification-fade-leave rc-notification-fade-leave-active":one.is_finished},
                        {"rc-notification-fade-enter rc-notification-fade-enter-active":one.is_uploading})}>
                        <div>
                            <div>
                                <h3 className="font-bold text-sm">{one.file.name}</h3>
                                <div className="text-xs">
                                    {
                                        (one.is_abort)
                                        ? <span className="msg-text">{t('abort')}</span>
                                        : null
                                    }
                                    {
                                        (one.is_success)
                                        ? <span className="msg-text">{t('success')}</span>
                                        : null
                                    }
                                    {
                                        (one.is_uploading)
                                        ?  <progress className="progress w-56 progress-primary" value={one.upload_progress} max="100"></progress>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="ml-2">
                            {
                                (one.is_uploading) 
                                ?  <a className="cursor-pointer" onClick={(event)=>{
                                        this.abort(one.file);
                                        event.stopPropagation();
                                        return false;
                                    }}>
                                    <XCircleIcon className="w-6 h-6"/>
                                </a>
                                : null
                            }
                        </div>
                    </div>
                })
            }
        </div>
        </div>
    }
}

export default UploadComponent