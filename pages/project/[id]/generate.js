import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
import GenerateFrom from 'components/image/generate/form';

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import withClubView from 'hocs/clubview'
import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'


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
    }

    @autobind
    loadGenerateList() {
        
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

        this.listRef.current.refresh();
    }


    render() {
        const {t} = this.props.i18n;
        const {is_adding,is_init} = this.state;
        const {club_id,active_club} = this.props;


        let init_data ={
            'collection_size' : 5000,
        }

        let formSchema = Yup.object().shape({
            collection_size      : Yup.number().required(),
        });

        

        return <PageWrapper>
            <Head>
                <title>{t('generate nft')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={t('generate nft')}/>

                <ClubStep club_id={club_id} active={2}/>
                
                <div className="max-w-screen-xl mx-auto">


                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h1 className='h1'>{t('generate')}</h1>
                            <GenerateFrom />
                        </div>

                        <div className='grid grid-cols-8 gap-16'>


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
