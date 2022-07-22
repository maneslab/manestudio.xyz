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

import Notification from 'components/common/notification';

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
                    <div className='mt-48 mb-12'>
                        <Logo className="h-12" />
                    </div>
                    <div className="max-w-prose mb-12" >{t('landing-page-intro')}</div>
                    <div>
                        <button onClick={()=>{
                            Notification.error({
                                message: '测试代码',
                                description : '测试代码2',
                            })
                        }}>测试代码</button>
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
