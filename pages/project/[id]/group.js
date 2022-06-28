import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import {updateClub} from 'redux/reducer/club'

import CreateGroupModal from 'components/image/group/create_modal'
import GroupList from 'components/image/group/list'
import ImageSpecialList from 'components/image/special/list'

import withClubView from 'hocs/clubview'
import { PlusIcon } from '@heroicons/react/solid';

import {uploadRequest,getUploadImageUrl} from 'helper/http'
import Upload from 'components/common/upload'
import { addSpecial } from 'redux/reducer/image/special';


@withTranslate
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_create_modal : false
        }
        this.handleUpload = ::this.handleUpload
        this.listRef = React.createRef();
        this.spListRef = React.createRef();
    }


    @autobind
    toggleCreateModal() {
        this.setState({
            show_create_modal : !this.state.show_create_modal
        })
    }

    @autobind
    refreshList() {
        if (this.listRef.current) {
            this.listRef.current.refresh();
        }
    }

    async handleUpload(data) {
        console.log('debug04,data',data)
        await this.props.addSpecial({
            img_id : data.data.img_id,
            club_id : this.props.club_id
        })

        this.spListRef.current.refresh();
    }


    render() {
        const {t} = this.props.i18n;
        const {is_adding,is_init} = this.state;
        const {list_count,club_id,active_club} = this.props;


        const uploadProps = uploadRequest({
            showUploadList : true,
            multiple: true,
            action: getUploadImageUrl(active_club),
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        return <PageWrapper>
            <Head>
                <title>{t('generate nft')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={t('generate nft')}/>

                <ClubStep club_id={club_id} active={1}/>
                
                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h2 className='h2'>{t('group')}</h2>
                            <button className='btn btn-default' onClick={this.toggleCreateModal}>
                                <PlusIcon className='icon-xs mr-2'/>
                                {t('add group')}
                            </button>
                        </div>

                        <GroupList club_id={this.props.club_id} ref={this.listRef}/>

                    </div>

                    <div className='col-span-3'>
                        <div className='block-intro'>
                            <h3>{t('about group')}</h3>
                            <div className='ct'>
                            <p>
                                {t('By adding groups, you are able to create sub-collections that use their own designed traits. For example, for a PFP collection, if the character are shaped differently, the position of their eyes and mouths must be designed accordingly with different scales and positions. Therefore, you can create groups for each of the base characters.')}
                            </p>
                            <p>
                                {t('If you want to bring some 1/1s to your collection, you can add them in step “Metadata” later.')}
                            </p>
                            </div>
                        </div>
                    </div>


                    <div className='col-span-5'>

                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h2 className='h2'>{t('spcail NFT')}</h2>

                            <Upload uploadProps={uploadProps} afterSuccess={this.handleUpload}>  
                            <button className='btn btn-default'>
                                <PlusIcon className='icon-xs mr-2'/>
                                {t('add spcail NFT')}
                            </button>
                            </Upload>
                           
                        </div>

                        <ImageSpecialList club_id={this.props.club_id} ref={this.spListRef}/>

                    </div>

                    <div className='col-span-3'>
                        <div className='block-intro'>
                            <h3>{t('about spcail NFT')}</h3>
                            <div className='ct'>
                            <p>
                                {t('Special NFT is a hidden section of the NFT series, each with a special a picture, and will only appear once')}
                            </p>
                            </div>
                        </div>
                    </div>
                    
                    <CreateGroupModal refreshList={this.refreshList} club_id={this.props.club_id} list_count={list_count} visible={this.state.show_create_modal} closeModal={this.toggleCreateModal}/>

                </div> 
            </div>
    </PageWrapper>
    }
    
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        addSpecial : (data) => {
            return dispatch(addSpecial(data))
        }
    }
}
function mapStateToProps(state,ownProps) {
    let list_data = state.getIn(['image_group','list',ownProps.club_id,'list']) ? state.getIn(['image_group','list',ownProps.club_id,'list']) : null;
    let list_count = 0;
    if (list_data) {
        list_count = list_data.count();
    }
    return {
        list_count : list_count
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
