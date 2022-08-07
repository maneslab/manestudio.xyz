import React from 'react';

import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form,FieldArray } from 'formik';
import * as Yup from 'yup';

import CreatorEditorOne from 'components/creator/editor_one'


import { PlusIcon } from '@heroicons/react/outline';

import {saveCreatorList,loadCreatorList} from 'redux/reducer/creator'
import {DndContext,closestCenter,DragOverlay} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';
import { denormalize } from 'normalizr';
import {creatorListSchema} from 'redux/schema/index'
import { defaultListData } from 'helper/common';
import {url} from 'helper/regex'
import message from 'components/common/message'


@withTranslate
@withMustLogin
class CreatorUpdate extends React.Component {

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
            this.props.loadCreatorList({
                'club_id'   :   this.props.club_id
            });
        }
        if (this.props.creators && this.props.creators.count() > 0) {
            this.setForm(this.props.creators)
        }
        // 
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.props.loadCreatorList({
                'club_id'   :   this.props.club_id
            });
        }

        if (this.props.creators && !this.props.creators.equals(prevProps.creators)) {
            this.setForm(this.props.creators)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    @autobind
    setForm(creators) {
        this.formRef.current.setValues({
            'creators' : creators.toJS()
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

        const {t} = this.props.i18n;

        this.setState({
            'is_updating' : true
        })
        
        try {

            await this.props.saveCreatorList({
                club_id : this.props.club.get('id'),
                json_data : JSON.stringify(values['creators'])
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

            let values = Array.from(this.formRef.current.values.creators);
            let item = this.formRef.current.values.creators[begin_index];

            values.splice(begin_index, 1);

            values.splice(end_index, 0, item);
    
            this.formRef.current.setValues({
                'creators' : values
            })
    
        }

        this.setState({
            'draging_index': null
        })
    }

    @autobind
    addCreatorOne(arrayHelpers) {
        let rl = this.formRef.current.values.creators.length
        let uid =new Date().getTime();

        arrayHelpers.push({  
            id : uid ,
            name    :  '',
            title   :  '',
            bio     :  '',
            email   :   '',
            link    :   '',
            discord :   '',
            twitter_id      :  '',
            instagram_id    :  '',
        });
        this.setState({
            'open_index' : rl
        })
    }

    @autobind
    updateCreatorImage(index,data) {
        if (!this.formRef.current.values.creators || !this.formRef.current.values.creators[index]) {
            return false;
        }

        console.log('debug06,data',data,index)
        let creators = this.formRef.current.values.creators;
        creators[index]['img'] = data['data'];
        creators[index]['img_id'] = data['data']['img_id'];

        console.log('debug06,creators',creators)

        this.formRef.current.setValues({
            creators : creators
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_updating,open_index,draging_index} = this.state;
        const {club} = this.props;

        let init_data ={
            'creators' :  [],
        }

        const formSchema = Yup.object().shape({
            creators      :  Yup.array()
            .of(Yup.object().shape({
                name    :  Yup.string().max(32),
                title   :  Yup.string().max(64),
                bio     :  Yup.string().max(1024),
                email   :  Yup.string().email().max(1024),
                link    :  Yup.string().matches(url,'must be url').max(1024),
                discord :  Yup.string().max(128),
                twitter_id      :  Yup.string().max(128),
                instagram_id    :  Yup.string().max(128),
            }))
        });



        return  <div>
            <div className='block-title capitalize'>{t('creator')}</div>
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
                                name="creators"
                                render={arrayHelpers => (
                                    <div>
                                        <DndContext
                                            onDragStart={this.handleDragStart}
                                            onDragEnd={this.handleDragEnd}
                                            // collisionDetection={closestCenter}
                                        >
                                            <SortableContext items={Object.keys(values.creators)}>
                                                {values.creators.map((one,index) => <CreatorEditorOne 
                                                    remove={arrayHelpers.remove}
                                                    key={one.id} 
                                                    id={index}
                                                    club={club}
                                                    errors={errors['creators'] ? errors['creators'][index] : null}
                                                    draging_index={draging_index}
                                                    open_index={open_index} 
                                                    toggleOpen={this.toggleOpen}
                                                    updateCreatorImage={this.updateCreatorImage}
                                                    creator={one}
                                                />)}
                                            </SortableContext>

                             
                                        </DndContext>

                                        <div className='flex justify-between items-center'>
                                            <button
                                            type="button"
                                            className='btn btn-outline'
                                            onClick={this.addCreatorOne.bind({},arrayHelpers)}
                                            >
                                                <PlusIcon className='w-4 mr-2' /> {t('add creator')}
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
                                <div className='ct'>
                                    <p>{t('creator-intro')}</p>
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
        loadCreatorList : (data) => {
           return dispatch(loadCreatorList(data))
        },
        saveCreatorList : (data) => {
            return dispatch(saveCreatorList(data))
        }
    }
}
function mapStateToProps(state,ownProps) {

    let club_id = ownProps.club.get('id');
    let list_data = state.getIn(['creator','list',club_id]);

    if (!list_data) {
        list_data = defaultListData
    }
    let creators = denormalize(list_data.get('list'),creatorListSchema,state.get('entities'));

    return {
        creators : creators,
        list_data : list_data,
        club_id   : club_id
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreatorUpdate)