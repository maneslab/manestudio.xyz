import React from 'react';

import autobind from 'autobind-decorator'
import classNames from 'classnames'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form,FieldArray,Field } from 'formik';
import * as Yup from 'yup';

import RoadmapEditorOne from 'components/roadmap/editor_one'

import { PlusIcon } from '@heroicons/react/outline';

import message from 'components/common/message'
import {DndContext,closestCenter} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';

@withTranslate
@withMustLogin
class RoadmapUpdate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_updating : false,
            open_index  : 0,
            draging_index : null
        }

        this.timer  = null;
        this.formRef = React.createRef();
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
        // this.formRef.current.setValues({
        //     'name' : (club && club.get('name')) ? club.get('name') : '',
        //     'unique_name' :  (club && club.get('unique_name')) ? club.get('unique_name') : ''
        // })
    }

    @autobind
    toggleOpen(index) {
        console.log('debug05,toggleOpen',index)
        if (this.state.open_index === index) {
            this.setState({
                'open_index' :null
            })
        }else {
            this.setState({
                'open_index': index
            })
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

    @autobind
    handleDragStart(event) {
        const {active, over} = event;
        this.setState({
            'draging_index': active.id
        })
    }

    @autobind
    handleDragEnd(event) {
        const {active, over} = event;
        console.log('debug05,handleDragEnd',active,over);
        this.setState({
            'draging_index': null
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_updating,open_index,draging_index} = this.state;
        const {club} = this.props;


        let init_data ={
            'roadmaps' :  [

            ],
        }

        const formSchema = Yup.object().shape({
            roadmaps      :  Yup.array()
            .of(Yup.object().shape({
                time_point: Yup.string().max(32),
                milestone :  Yup.string().max(128),
                description :  Yup.string().max(1024),
            }))
        });


        /* {values.roadmaps.map((roadmap, index) => {
            let is_show = (index === open)
            let is_empty = (!values.roadmaps[index]['time_point'] && !values.roadmaps[index]['milestone'])
            return <TestOne key={index+1} id={index}/>
            return (
                <RoadmapEditorOne 
                    remove={arrayHelpers.remove}
                    key={index} 
                    is_show={is_show} 
                    is_empty={is_empty} 
                    toggleOpen={this.toggleOpen}
                    index={index}
                    data={values.roadmaps[index]}/>
            )}
        )}*/

        return  <div>
            <div className='font-bold text-white text-2xl mb-2'>Roadmap</div>
            <Formik
                innerRef={this.formRef}
                initialValues={init_data}
                validationSchema={formSchema}
                // onSubmit={this.save}
                >
                {({ 
                    values,
                    errors, 
                    touched }) => {
                    
                    console.log('debug03,values',values);
                    console.log('debug05，keys',Object.keys(values.roadmaps))

                    return (
                    
                    <Form>

                    <div>{
                        console.log('devyg93,values',values)
                    }</div>                    
                    <div className='block-wapper-one mb-4'>
                        <div className='l'>
                            <div className='form-box-one'>

                            <FieldArray
                                name="roadmaps"
                                render={arrayHelpers => (
                                    <div>
                                        <DndContext
                                            onDragStart={this.handleDragStart}
                                            onDragEnd={this.handleDragEnd}
                                            collisionDetection={closestCenter}
                                        >
                                            <SortableContext items={Object.keys(values.roadmaps)}>
                                                {values.roadmaps.map((one,index) => <RoadmapEditorOne 
                                                    remove={arrayHelpers.remove}
                                                    key={index} 
                                                    id={index}
                                                    draging_index={draging_index}
                                                    open_index={open_index} 
                                                    toggleOpen={this.toggleOpen}
                                                    roadmap={one}
                                                />)}
                                            </SortableContext>
                                        </DndContext>

                                        <div>
                                            <button
                                            type="button"
                                            className='btn'
                                            onClick={() => arrayHelpers.push({ name: '', age: '' })}
                                            >
                                                <PlusIcon className='w-4' /> {t('add roadmap')}
                                            </button>
                                        </div>
                                    </div>
                                    )}

                            />

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
                )}}
            </Formik>
        </div>

    }
    
}


export default RoadmapUpdate

