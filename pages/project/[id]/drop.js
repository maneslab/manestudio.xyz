import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {updateClub} from 'redux/reducer/club'

import RoadmapUpdate from 'components/roadmap/update'

import PrefixInput from 'components/form/prefix_input';

import Input from 'components/form/field'
import Button from 'components/common/button'
import Textarea from 'components/form/textarea'

import ClubUpdate from 'components/club/update'
import withClubView from 'hocs/clubview'

@withTranslate
@withMustLogin
@withClubView
class ClubDropSetting extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_adding : false,
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
        const {club} = this.props;


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
                <title>{'Drop details'}</title>
            </Head>
            <div className="max-w-screen-xl mx-auto">


                <div className='flex justify-between items-center mb-8'>
                    <h1 className='h1 text-white'>{t('drop details')}</h1>
                    <button className='btn btn-primary' onClick={this.toggleCreateModal}>
                        {t('add project')}
                    </button>
                </div>

                <ClubUpdate club={club} updateClub={this.props.updateClub}/>

                <RoadmapUpdate club={club} updateClub={this.props.updateClub}/>

            </div> 
    </PageWrapper>
    }
    
}

ClubDropSetting.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        updateClub : (id,data) => {
           return dispatch(updateClub(id,data))
        },
    }
}
function mapStateToProps(state,ownProps) {
   return {
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(ClubDropSetting)
