import React from 'react'

import DreamEditor from 'dream-editor/dist/index'
import {isDraft} from 'helper/draft'
import {getEditorConfig} from 'helper/draft'


export default class Editor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.deRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.content && this.props.content !== prevProps.content) {
            //如果传入的内容不想等那么用新的覆盖
            console.log('如果传入的内容不想等那么用新的覆盖')
            this.setContent(this.props.content)
        }
    }

    getContent() {
        if (!this.deRef.current.editComponent.current) {
            return this.deRef.current.getContent();
        }else {
            return this.deRef.current.editComponent.current.getContent();
        }

    }

    setContent(content) {
        if (!content) {
            content = null;
        }

        if (!this.deRef.current.editComponent.current) {
            setTimeout(()=>{
                this.setContent(content)
            },1000);
        }else {
            return this.deRef.current.editComponent.current.setContent(JSON.parse(content));
        }
    }

    render() {
        let config = getEditorConfig();
        const is_draft = isDraft(this.props.content);

        let controls = [
            'unstyled',
            'header-one',
            'header-two',
            'header-three',
            'blockquote',
            'unordered-list-item',
            'ordered-list-item',
            'divider',
            'callout',

            'color',
            'background-color',

            'image',
            'video',
            // 'audio',
            'bookmark',
        ];


        return <DreamEditor 
            content={(is_draft) ? this.props.content : ''} 
            ref={this.deRef} 
            config={config} 
            controls={controls}
            readOnly={this.props.readOnly ? true : false} 
            summary={this.props.summary ? true : false} 
            summary_link={this.props.summary_link}/>
    }

}

