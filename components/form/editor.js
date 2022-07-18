import React from 'react'
import dynamic from 'next/dynamic'
import 'braft-editor/dist/index.css'
// import { t } from 'helper/translate'
import { convertToRaw } from 'draft-js';

import { getApiUrl } from 'helper/common'
import {getJwtToken} from 'helper/cookie'

import {
    convertRawToEditorState,
    convertEditorStateToRaw,
  } from 'braft-convert';
  

const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false })

export default class Editor extends React.Component {

    state = {
        editorState: null
    }

    setContent = (content) => {
        console.log('setContent',content);
        let editorState;
        if (content) {
            let json_content;
            if (typeof content == 'string') {
                json_content = JSON.parse(content);
            }else {
                json_content = content;
            }
            editorState = convertRawToEditorState(json_content);
        }else {
            editorState = null;
        }
        this.setState({
            editorState : editorState
        })
    }

    getContent = () => {
        let content = this.state.editorState.getCurrentContent();
        return convertToRaw(content);
    }

    submitContent = async () => {
        // Pressing ctrl + s when the editor has focus will execute this method
        // Before the editor content is submitted to the server, you can directly call editorState.toHTML () to get the HTML content
        const htmlContent = this.state.editorState.toHTML()
        const result = await saveEditorContent(htmlContent)
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    uploadFn(param) {
        const serverURL = getApiUrl('/v1/upload/img?template=post_image');
        const xhr = new XMLHttpRequest
        const fd = new FormData()
    
        const successFn = (response) => {
            console.log('successFn',response);

            let response_json = JSON.parse(xhr.responseText);
            console.log('response_json',response_json);

        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        param.success({
            url: response_json.data.image_urls.url,
            meta: {
            id: response_json.data.img_id,
            }
        })
        }
    
        const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress(event.loaded / event.total * 100)
        }
    
        const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
            msg: 'unable to upload.'
        })
        }
    
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
        
        fd.append('file', param.file)
        xhr.open('POST', serverURL, true)
        xhr.setRequestHeader("Authorization", getJwtToken())

        xhr.send(fd)
    }

    validateFn(file)  {
        return file.size < 1024 * 1024 * 10;
    }

    render () {
        const {label} = this.props;
        const { editorState } = this.state

        return (
            <div className='form-control'>
                <label className='label'>
                    <span className='label-text'>
                        {label}
                    </span>
                </label>
                <div className="d-bg-c-1 input-base">
                <BraftEditor
                    contentStyle={{height: 'auto', minHeight: 200}}
                    contentClassName="prose dark:prose-invert max-w-full"
                    language={'en'}
                    media={{
                        uploadFn : this.uploadFn,
                        validateFn : this.validateFn,
                        accepts : {
                            image: 'image/png,image/jpeg,image/gif',
                            video: false,
                            audio: false
                        }
                    }}
                    controls={[
                        'undo', 'redo', 'separator',
                        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                        'remove-styles', 'emoji', 'separator',
                        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                        'link', 'separator', 'hr', 'separator',
                        'media', 'separator',
                        'clear'
                    ]}
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    />
                </div>
            </div>
        )

    }

}