import React from 'react';

import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form,FieldArray } from 'formik';
import * as Yup from 'yup';

import GalleryOne from 'components/gallery/one'
import Upload from 'components/common/upload'

import { PlusIcon } from '@heroicons/react/outline';

import {saveGalleryList,loadGalleryList} from 'redux/reducer/gallery'
import {DndContext,closestCenter,DragOverlay} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';
import { denormalize } from 'normalizr';
import {galleryListSchema} from 'redux/schema/index'
import { defaultListData } from 'helper/common';
import {uploadRequest} from 'helper/http'


@withTranslate
@withMustLogin
class GalleryUpdate extends React.Component {

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
            this.props.loadGalleryList({
                'club_id'   :   this.props.club_id
            });
        }
        if (this.props.gallery && this.props.gallery.count() > 0) {
            this.setForm(this.props.gallery)
        }
        // 
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club_id && this.props.club_id != prevProps.club_id) {
            this.props.loadGalleryList({
                'club_id'   :   this.props.club_id
            });
        }

        if (this.props.gallery && !this.props.gallery.equals(prevProps.gallery)) {
            this.setForm(this.props.gallery)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    @autobind
    setForm(gallery) {
        console.log('debug06,gallery',gallery.toJS())
        
        let gallery_list = gallery.toJS();

        let value_list = [];
        gallery_list.map(one=>{
            value_list.push({
                'img_id' : one.img_id,
                'id'     : one.id,
                'image_urls' : one.img.image_urls
            })
        })

        console.log('debug06,value_list',value_list)

        this.formRef.current.setValues({
            'gallery' : value_list
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

        console.log('debug05,values',values);


        this.setState({
            'is_updating' : true
        })
        
        let img_ids = [];
        values.gallery.map(one=>{
            img_ids.push(one.img_id);
        })

        await this.props.saveGalleryList({
            club_id : this.props.club.get('id'),
            img_ids : img_ids.join(',')
        });

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
            console.log('debug05,handleDragEnd',active,over);

            let begin_index = Number(active.id)
            let end_index = Number(over.id)

            let values = Array.from(this.formRef.current.values.gallery);
            let item = this.formRef.current.values.gallery[begin_index];
            console.log('debug04,开始前',values)

            values.splice(begin_index, 1);
            console.log('debug04,中间',values)

            values.splice(end_index, 0, item);
    
            console.log('debug04,结束以后',values)
            this.formRef.current.setValues({
                'gallery' : values
            })
    
        }

        this.setState({
            'draging_index': null
        })
    }

    @autobind
    handleUpload(arrayHelpers,image) {
        console.log('image',image)
        let rl = this.formRef.current.values.gallery.length
        let uid =new Date().getTime();

        arrayHelpers.push({ 
            image_urls: image.data.image_urls , 
            img_id : image.data.img_id,
            id     : uid
        });
        this.setState({
            'open_index' : rl
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_updating,open_index,draging_index} = this.state;
        const {club} = this.props;

        let init_data ={
            'gallery' :  [],
        }

        const formSchema = Yup.object().shape({
            gallery      :  Yup.array()
            .of(Yup.object().shape({
                time_point  :  Yup.string().max(32),
                title       :  Yup.string().max(128),
                detail      :  Yup.string().max(1024),
            }))
        });

        const uploadProps = uploadRequest({
            showUploadList : false,
            multiple: false,
            action: '/v1/upload/img?template=gallery',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        return  <div>
            <div className='block-title'>{t('gallery')}</div>
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
                                name="gallery"
                                render={arrayHelpers => (
                                    <div>
                                    <div className='grid grid-cols-4 gap-4 mb-4'>
                                        <DndContext
                                            onDragStart={this.handleDragStart}
                                            onDragEnd={this.handleDragEnd}
                                            // collisionDetection={closestCenter}
                                        >
                                            <SortableContext items={Object.keys(values.gallery)}>
                                                {values.gallery.map((one,index) => <GalleryOne 
                                                    remove={arrayHelpers.remove}
                                                    key={one.id} 
                                                    id={index}
                                                    errors={errors['gallery'] ? errors['gallery'][index] : null}
                                                    draging_index={draging_index}
                                                    open_index={open_index} 
                                                    toggleOpen={this.toggleOpen}
                                                    img={one}
                                                />)}
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <Upload uploadProps={uploadProps} afterSuccess={this.handleUpload.bind({},arrayHelpers)}>  
                                                <button type="button" className='btn'>
                                                    <PlusIcon className='w-4 mr-2' /> {t('add image')}
                                                </button>
                                        </Upload>
                                        
                                        <button
                                        type="submit"
                                        className='btn btn-outline'
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
        loadGalleryList : (data) => {
           return dispatch(loadGalleryList(data))
        },
        saveGalleryList : (data) => {
            return dispatch(saveGalleryList(data))
        }
    }
}
function mapStateToProps(state,ownProps) {

    let club_id = ownProps.club.get('id');
    let list_data = state.getIn(['gallery','list',club_id]);

    if (!list_data) {
        list_data = defaultListData
    }
    let gallery = denormalize(list_data.get('list'),galleryListSchema,state.get('entities'));

    return {
        gallery : gallery,
        list_data : list_data,
        club_id   : club_id
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GalleryUpdate)