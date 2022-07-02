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
        console.log('called,refreshList',this.listRef.current)
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
        const {list_count,group_id,club_id} = this.props;
        console.log('this.listRef',this.listRef)

        return <PageWrapper>
            <Head>
                <title>{t('generate groups')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id}  title={t('generate nft')}/>
                <ClubStep club_id={club_id} active={1}  />

                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='pb-4 mb-4 border-b border-gray-300'>
                            <Link href={"/project/"+club_id+"/group"}>
                            <a className='flex justify-start items-center capitalize cursor-pointer'>
                                <ChevronLeftIcon className='icon-sm'/>
                                {t('back')}
                            </a>
                            </Link>
                        </div>

                        <div className='flex justify-between items-center mb-4 text-black'>
                            <h2 className='h2'>{t('layer')}</h2>
                            <button className='btn btn-default' onClick={this.toggleCreateModal}>
                                <PlusIcon className='icon-xs mr-2'/>
                                {t('add layer')}
                            </button>
                        </div>

                        <LayerList 
                            group_id={this.props.group_id} 
                            ref={this.listRef} 
                            />

                    </div>

                    <div className='col-span-3'>

                        <GenerateImage group_id={group_id} />

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




export default GenerateGroupView
