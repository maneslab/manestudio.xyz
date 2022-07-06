import React from 'react';

import autobind from 'autobind-decorator'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import PrefixInput from 'components/form/prefix_input';

import Input from 'components/form/field'
import Button from 'components/common/button'

import Editor from 'components/form/editor'
import message from 'components/common/message'

@withTranslate
@withMustLogin
class ClubUpdate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_updating : false,
        }

        this.timer  = null;
        this.formRef = React.createRef();
        this.editorRef = React.createRef();
    }

    componentDidMount() {
        this.setForm(this.props.club)
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club && !this.props.club.equals(prevProps.club)) {
            this.setForm(this.props.club)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    @autobind
    setForm(club) {

        console.log('debug-sp:调用到setFrom',club.toJS());

        this.formRef.current.setValues({
            'name' : (club && club.get('name')) ? club.get('name') : '',
            'unique_name' :  (club && club.get('unique_name')) ? club.get('unique_name') : ''
        })

        if (club && club.get('introduction')) {
            this.setEditor(club.get('introduction'))
        }
    }

    @autobind
    setEditor(content) {
        console.log('debug-sp:调用到setEditor',content);

        if (!this.editorRef.current) {
            this.timer = setTimeout(()=>{
                this.setEditor(content)
            },100)
        }else {
            this.editorRef.current.setContent(content);
        }
    }

    @autobind
    async save(values) {

        
        console.log('values',values);
        if (!this.editorRef.current) {
            message.error('editor is not init yet');
            return;
        }
        console.log('this.editorRef.current',this.editorRef.current);
        let introduction = this.editorRef.current.getContent();
        values['introduction'] = JSON.stringify(introduction);

        this.setState({
            'is_updating' : true
        })
        
        await this.props.updateClub(this.props.club.get('id'),values);

        this.setState({
            'is_updating' : false
        })
    }


    render() {
        const {t} = this.props.i18n;
        const {is_updating} = this.state;
        const {club} = this.props;


        let init_data ={
            'name' : '',
            'unique_name' : '',
        }

        const formSchema = Yup.object().shape({
            name      : Yup.string().required(),
            unique_name : Yup.string(),
        });

        return  <Formik
            innerRef={this.formRef}
            initialValues={init_data}
            validationSchema={formSchema}
            onSubmit={this.save}>
            {({ errors, touched }) => (
                
                <Form>
                
                <div className='block-wapper-one mb-4'>
                    <div className='l'>
                        <div className='form-box-one'>
                            <Input name="name" label={t("project name")} placeholder={t("any name you want")} />
                            <Editor label={t("description")} ref={this.editorRef}/>
                            <PrefixInput name="unique_name" label={t("link to the drop page")} placeholder={"customize-your-link-here"} prefix={"https://www.manespace.com/"} />
                            <div className='border-t d-border-c-1 my-4'></div>
                            <div className='flex justify-end'>
                            <Button loading={is_updating} className="btn btn-default" type="submit">{t("save")}</Button>
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

                </Form>
            )}
        </Formik>

    }
    
}


export default ClubUpdate

