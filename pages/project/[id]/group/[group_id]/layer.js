import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {updateClub} from 'redux/reducer/club'

import message from 'components/common/message'

import CreateLayerModal from 'components/image/layer/create_modal'
import LayerList from 'components/image/layer/list'

import withClubView from 'hocs/clubview'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/solid';
import {setActiveClub} from 'redux/reducer/setting'

import { denormalize } from 'normalizr';
import { clubSchema } from 'redux/schema/index'


@withTranslate
@withMustLogin
@withClubView
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_create_modal : false
        }
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.props.setActiveClub(this.props.club_id)
    }

    componentDidUpdate(prevProps) {
        if (this.props.club_id != prevProps.club_id) {
            this.props.setActiveClub(this.props.club_id);
        }
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

    render() {
        const {t} = this.props.i18n;
        const {list_count,group_id,club_id} = this.props;

        return <PageWrapper>
            <Head>
                <title>{t('generate groups')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id}/>
                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='pb-4 mb-4 border-b border-gray-300'>
                            <a className='flex justify-start items-center capitalize cursor-pointer'>
                                <ChevronLeftIcon className='icon-sm'/>
                                {t('back')}
                            </a>
                        </div>

                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h1 className='h1'>{t('layer')}</h1>
                            <button className='btn btn-primary' onClick={this.toggleCreateModal}>
                                <PlusIcon className='icon-xs mr-2'/>
                                {t('add layer')}
                            </button>
                        </div>

                        <LayerList group_id={this.props.group_id} ref={this.listRef} />

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

                    <CreateLayerModal refreshList={this.refreshList} 
                        group_id={group_id} 
                        list_count={list_count} 
                        visible={this.state.show_create_modal} 
                        closeModal={this.toggleCreateModal}/>

                </div> 
            </div>
    </PageWrapper>
    }
    
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id,
        group_id: query.group_id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        setActiveClub : (id) => {
            return dispatch(setActiveClub(id))
        }
    }
}
function mapStateToProps(state,ownProps) {
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
