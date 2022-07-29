import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import Link from 'next/link'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
import GenerateImage from 'components/image/generate/image'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'


import CreateLayerModal from 'components/image/layer/create_modal'
import LayerList from 'components/image/layer/list'

import withClubView from 'hocs/clubview'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/solid';


@withTranslate
@withMustLogin
@withClubView
@withSetActiveClub
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_create_modal   : false,
            select_traits       : {}
        }
        this.listRef = React.createRef();
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

    @autobind
    selectTrait(layer_id,trait_id) {
        let {select_traits} = this.state;
        select_traits[layer_id] = trait_id;
        this.setState({
            select_traits
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {list_count,group_id,club_id,club} = this.props;
        console.log('this.listRef',this.listRef)

        let is_lock = false;
        if (club) {
            is_lock = club.get('is_lock');
        }
        

        return <PageWrapper>
            <Head>
                <title>{t('generate groups')}</title>
            </Head>
            <div>
                <ClubHeader club={club}  title={t('artworks')} active_id={1} intro={t('generate-nft-header-intro')}/>
                <ClubStep club_id={club_id} active_name={'setting'} project_type={(club)?club.get('project_type'):'use_generator'} next_step={false} is_lock={is_lock} />

                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='pb-4 mb-4 border-b border-gray-300 dark:border-gray-800'>
                            <Link href={"/project/"+club_id+"/group"}>
                            <a className='btn btn-primary'>
                                <ChevronLeftIcon className='icon-sm'/>
                                {t('save & back')}
                            </a>
                            </Link>
                        </div>

                        <div className='flex justify-between items-center mb-4 text-black dark:text-white'>
                            <h2 className='h2'>{t('layer')}</h2>
                            {
                                (!is_lock)
                                ? <button className='btn btn-default' onClick={this.toggleCreateModal}>
                                    <PlusIcon className='icon-xs mr-2'/>
                                    {t('add layer')}
                                </button>
                                : null
                            }
                        </div>

                        <LayerList 
                            group_id={this.props.group_id} 
                            is_lock={is_lock}
                            ref={this.listRef} 
                            />

                    </div>

                    <div className='col-span-3'>

                        <GenerateImage group_id={group_id} />

                        <div className='block-intro'>
                            <h3>{t('about layer and trait')}</h3>
                            <div className='ct'>
                            <p>
                                {t('Layer-intro-1')}
                            </p>
                            <p>
                                {t('Layer-intro-2')}
                            </p>
                            <p>
                                {t('Layer-intro-3')}
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




export default GenerateGroupView
