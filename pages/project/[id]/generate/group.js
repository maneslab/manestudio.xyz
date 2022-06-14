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

import RoadmapUpdate from 'components/roadmap/update'
import GalleryUpdate from 'components/gallery/update'
import CreatorUpdate from 'components/creator/update'

import ClubUpdate from 'components/club/update'
import withClubView from 'hocs/clubview'


@withTranslate
@withMustLogin
@withClubView
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_create_modal : false
        }
    }


    @autobind
    toggleCreateModal() {
        this.setState({
            show_create_modal : !this.state.show_create_modal
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_adding,is_init} = this.state;
        const {club,club_id} = this.props;


        let init_data ={
            'name' : '',
            'project_type' : 'use_generator'
        }

        const formSchema = Yup.object().shape({
            name      : Yup.string().required(),
            project_type : Yup.string().required(),
        });

        return <PageWrapper>
            <Head>
                <title>{t('generate groups')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id}/>
                <div className="max-w-screen-xl mx-auto grid grid-cols-8 gap-16">

                    <div className='col-span-5'>

                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h1 className='h1'>{t('group')}</h1>
                            <button className='btn btn-primary' onClick={this.toggleCreateModal}>
                                {t('add group')}
                            </button>
                        </div>

                    </div>

                    <div className='col-span-3'>
                        <div className='block-intro'>
                            <h3>About Group</h3>
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
    }
}
function mapStateToProps(state,ownProps) {
   return {
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
