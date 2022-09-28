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
        const {list_count,club_id,active_club,club} = this.props;


        const uploadProps = uploadRequest({
            showUploadList : true,
            multiple: true,
            action: getUploadImageUrl(active_club),
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })
        
        let is_lock = false;
        if (club) {
            is_lock = club.get('is_lock');
        }

        if (club) {
            console.log('debug-club',club.toJS());
        }else {
            console.log('debug-club-no-exist');
        }

        if (active_club) {
            console.log('debug-active_club',active_club.toJS());
        }else {
            console.log('debug-active_club-no-exist');
        }
        
        
        return <PageWrapper>
            <Head>
                <title>{t('generate nft')}</title>
            </Head>
            <div>
                <ClubHeader club={club} title={t('artworks')} active_id={1} intro={t('generate-nft-header-intro')}/>

                <ClubStep 
                    club_id={club_id} 
                    active_name={'setting'} 
                    project_type={(club)?club.get('project_type'):null}
                    is_lock={is_lock}
                    />
                
                {
                    (club && club.get('project_type') == 'use_generator')
                    ? <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16 mb-8">

                            <div className='col-span-5'>

                                <div className='flex justify-between items-center mb-8 text-black dark:text-white'>
                                    <h2 className='h2'>{t('group')}</h2>
                                    {
                                        (!is_lock)
                                        ?  <button className='btn btn-default' onClick={this.toggleCreateModal}>
                                            <PlusIcon className='icon-xs mr-2'/>
                                            {t('add group')}
                                        </button>
                                        : null
                                    }
                                </div>

                                <GroupList club_id={this.props.club_id} ref={this.listRef} is_lock={is_lock}/>

                            </div>

                        

                        <div className='col-span-3'>
                            <div className='block-intro'>
                                <h3>{t('about group')}</h3>
                                <div className='ct'>
                                <p>
                                    {t('Group-intro-1')}
                                </p>
                                <p>
                                    {t('Group-intro-2')}
                                </p>
                                <p>
                                    {t('Group-intro-3')}
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }

                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='flex justify-between items-center mb-8 text-black dark:text-white'>
                            <h2 className='h2'>{'1/1 NFTs'}</h2>

                            {
                                (!is_lock)
                                ?  <Upload uploadProps={uploadProps} afterSuccess={this.handleUpload}>  
                                    <button className='btn btn-default capitalize'>
                                        <PlusIcon className='icon-xs mr-2'/>
                                        {t('ADD 1/1 NFTs')}
                                    </button>
                                </Upload>
                                : null
                            }
                           
                        </div>

                        <ImageSpecialList club_id={this.props.club_id} ref={this.spListRef} is_lock={is_lock}/>

                    </div>

                    <div className='col-span-3'>
                        <div className='block-intro'>
                            <h3>{t('about 1/1 NFTs')}</h3>
                            <div className='ct'>
                                <p>
                                    {t('about-1-1-intro-1')}
                                </p>
                                <p>
                                    {t('about-1-1-intro-2')}
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
