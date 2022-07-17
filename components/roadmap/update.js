import React from 'react';

import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form,FieldArray } from 'formik';
import * as Yup from 'yup';

import RoadmapEditorOne from 'components/roadmap/editor_one'

import { PlusIcon } from '@heroicons/react/outline';

import {saveRoadmapList,loadRoadmapList} from 'redux/reducer/roadmap'
import {DndContext,closestCenter,DragOverlay} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';
import { denormalize } from 'normalizr';
import {roadmapListSchema} from 'redux/schema/index'
import { defaultListData } from 'helper/common';
import message from 'components/common/message'

@withTranslate
@withMustLogin
class RoadmapUpdate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_updating     : false,
            open_index      : null,
            draging_index   : null
        }

        this.timer  = null;
        this.formRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.club_id) {
            this.props.loadRoadmapList({
                'club_id'   :   this.props.club_id
            });
        }
        if (this.props.roadmaps && this.props.roadmaps.count() > 0) {
            this.setForm(this.props.roadmaps)
        }
        // 
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.props.loadRoadmapList({
                'club_id'   :   this.props.club_id
            });
        }

        if (this.props.roadmaps && !this.props.roadmaps.equals(prevProps.roadmaps)) {
            this.setForm(this.props.roadmaps)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    @autobind
    setForm(roadmaps) {
        this.formRef.current.setValues({
            'roadmaps' : roadmaps.toJS()
        })
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

        this.setState({
            'is_updating' : true
        })
        
        const {t} = this.props.i18n;

        try {

            await this.props.saveRoadmapList({
                club_id : this.props.club.get('id'),
                json_data : JSON.stringify(values['roadmaps'])
            });

            message.success(t('save success'));

        }catch(e) {
            message.error(t('save failed'));
        }


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

        if (over) {

            let begin_index = Number(active.id)
            let end_index = Number(over.id)

            let values = Array.from(this.formRef.current.values.roadmaps);
            let item = this.formRef.current.values.roadmaps[begin_index];

            values.splice(begin_index, 1);

            values.splice(end_index, 0, item);
    
            this.formRef.current.setValues({
                'roadmaps' : values
            })
    
        }

        this.setState({
            'draging_index': null
        })
    }

    @autobind
    addRoadmapOne(arrayHelpers) {
        let rl = this.formRef.current.values.roadmaps.length
        let uid =new Date().getTime();

        arrayHelpers.push({ time_point: '', title: '' , detail: '' , id : uid});
        this.setState({
            'open_index' : rl
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_updating,open_index,draging_index} = this.state;
        const {club} = this.props;

        let init_data ={
            'roadmaps' :  [],
        }

        const formSchema = Yup.object().shape({
            roadmaps      :  Yup.array()
            .of(Yup.object().shape({
                time_point  :  Yup.string().max(32),
                title       :  Yup.string().max(128),
                detail      :  Yup.string().max(1024),
            }))
        });



        return  <div>
            <div className='block-title'>{t('roadmap')}</div>
            <Formik
                innerRef={this.formRef}
                initialValues={init_data}
                validationSchema={formSchema}
                onSubmit={this.save}
                >
                {({ 
                    values,
                    errors, 
                    touched }) => {
                    return (<Form>
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
                                        >
                                            <SortableContext items={Object.keys(values.roadmaps)}>
                                                {values.roadmaps.map((one,index) => <RoadmapEditorOne 
                                                    remove={arrayHelpers.remove}
                                                    key={one.id} 
                                                    id={index}
                                                    errors={errors['roadmaps'] ? errors['roadmaps'][index] : null}
                                                    draging_index={draging_index}
                                                    open_index={open_index} 
                                                    toggleOpen={this.toggleOpen}
                                                    roadmap={one}
                                                />)}
                                            </SortableContext>

                             
                                        </DndContext>

                                        <div className='flex justify-between items-center'>
                                            <button
                                            type="button"
                                            className='btn btn-outline'
                                            onClick={this.addRoadmapOne.bind({},arrayHelpers)}
                                            >
                                                <PlusIcon className='w-4 mr-2' /> {t('add roadmap')}
                                            </button>
                                            <button
                                            type="submit"
                                            className='btn btn-default'
                                            >
                                                {t('save')}
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
const mapDispatchToProps = (dispatch) => {
    return {
        loadRoadmapList : (data) => {
           return dispatch(loadRoadmapList(data))
        },
        saveRoadmapList : (data) => {
            return dispatch(saveRoadmapList(data))
        }
    }
}
function mapStateToProps(state,ownProps) {

    let club_id = ownProps.club.get('id');
    let list_data = state.getIn(['roadmap','list',club_id]);

    if (!list_data) {
        list_data = defaultListData
    }
    let roadmaps = denormalize(list_data.get('list'),roadmapListSchema,state.get('entities'));

    return {
        roadmaps : roadmaps,
        list_data : list_data,
        club_id   : club_id
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RoadmapUpdate)