import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'

import PageWrapper from 'components/pagewrapper'

import MyClubList from 'components/club/mylist'
import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
// import { t } from 'helper/translate';
import CreateModal from 'components/club/create_modal'

@withTranslate
@withMustLogin
class ClubList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_create_modal : false,
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
        const {show_create_modal} = this.state;

        return <PageWrapper>
            <Head>
                <title>{'My Project List'}</title>
            </Head>
            <div className="max-w-screen-xl grid grid-cols-3 gap-4 mx-auto">
                <div className="col-span-2">
                    <div className='flex justify-between items-center mb-8'>
                        <h1 className='h1 text-white'>My project</h1>
                        <button className='btn btn-primary' onClick={this.toggleCreateModal}>
                            {t('add project')}
                        </button>
                    </div>
                    <MyClubList />
                    <CreateModal visible={show_create_modal} closeModal={this.toggleCreateModal}/>
                </div>
                <div class="">

                </div>
            </div> 
    </PageWrapper>
    }
    
}

ClubList.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
    };
});

export default ClubList
