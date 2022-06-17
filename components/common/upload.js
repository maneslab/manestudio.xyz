import React from 'react';
import autobind from 'autobind-decorator'

import {XCircleIcon} from '@heroicons/react/outline'
//PhotographIcon
// import {uploadRequest} from 'helper/http'
import Upload from 'rc-upload'

import message from 'components/common/message'
const { Dragger } = Upload;

export default class UploadComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'is_begin_upload' : false,
            'upload_progress' : 0,
        }
        this.uploadRef = React.createRef();
    }

    @autobind
    setBeginUpload(file) {
        this.setState({
            'is_begin_upload' : true,
            'upload_progress' : 0,
        })
    } 

    @autobind
    setProgress(file,value) {
        this.setState({
            'upload_progress' : value
        })
    } 


    @autobind
    setUploadFinish(file,value) {
        this.setState({
            'upload_progress' : 0,
            'is_begin_upload' : false,
        })
    } 

    @autobind
    reset() {
        this.setState({
            'upload_progress' : 0,
            'is_begin_upload' : false,
        })
    }

    @autobind
    abort() {
        console.log('this.uploadRef',this.uploadRef);
        this.uploadRef.current.abort();
        this.reset()
    }

    @autobind
    uploadSuccess(response,file) {

        if (typeof this.props.afterSuccess == 'function') {
            this.props.afterSuccess(response,file);
        }

        console.log('debug07,response',response)
        console.log('debug07,file',file)
        console.log('debug07,file.name',file.name)

        message.success(`${file.name} file uploaded successfully`);

        this.reset()
    }


    @autobind 
    uploadError(err,body) {
        const {file} = this.state;

        console.log('err',err,body);

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


        this.reset()
    }


    render() {
        const {uploadProps} = this.props;
        const {is_begin_upload,upload_progress,file} = this.state

        const {setBeginUpload,setProgress,setUploadFinish,uploadSuccess,uploadError} = this;

        const newUploadProps = Object.assign(uploadProps,{
            beforeUpload(file) {
                console.log('debug07,->准备上传文件', file.name);
            },
            onStart: file => {
                console.log('debug07,->开始上传', file.name);
                setBeginUpload(file);
            },
            onSuccess(response,file) {
                console.log('debug07,->上传成功', response,file);
                // setUploadFinish();
                uploadSuccess(response,file)
            },
            onProgress(step, file) {
                console.log('debug07,->上传进度',step,file);

                setProgress(file,Math.round(step.percent));
            },
            onError(err,body) {
                uploadError(err,body);
            },
        })

        return <Upload ref={this.uploadRef} {...newUploadProps}>
            {
                (is_begin_upload)
                ? <div className='w-64 flex justify-between items-center'>
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
                </div> 
                : this.props.children
            }
        </Upload>
    }
}
