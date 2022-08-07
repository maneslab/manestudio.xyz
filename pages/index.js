import React, { useState,useEffect } from 'react';

import {wrapper} from 'redux/store';
import { connect } from "react-redux";
import PageWrapper from 'components/pagewrapper'

import Head from 'next/head'
import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import Logo from 'public/img/logo.svg'

import withWallet from 'hocs/wallet';
import MustLoginWrapper from 'components/must_login';

@withTranslate
@withWallet
class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {t} = this.props.i18n;
        const {wallet} = this.props;


        return <PageWrapper theme={'blue'} wapperClassName="landingpage">
            <Head>
                <title>ManeStudio</title>
            </Head>
            <div className="">

                <div className='max-w-screen-xl mx-auto text-white'>
                    <div className='mt-24 mb-12'>
                        <Logo className="h-12" />
                    </div>
                    <div className="max-w-prose mb-12" >
                        <div className='mb-4'>{t('landing-page-intro-1')}</div>
                        <div className=''>{t('landing-page-intro-2')}</div>
                    </div>
                    <div>
                        <button className="btn btn-secondary mr-2 capitalize text-base">{t('learn more')}</button>
                        <Link href="/project/list">
                            <button className='btn btn-primary capitalize text-base'>{t('launch app')}</button>
                        </Link>
                    </div>
                </div>
            </div>
    </PageWrapper>
    }

    
}

Home.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
    };
});

const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'status' : state.getIn(['setting','status']),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)

