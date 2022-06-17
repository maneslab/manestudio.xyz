import React, { useState,useEffect } from 'react';

import {wrapper} from 'redux/store';
import { connect } from "react-redux";
import PageWrapper from 'components/pagewrapper'

import Head from 'next/head'
import { withRouter } from 'next/router'
import {withTranslate} from 'hocs/index'
import config from 'helper/config';

import PersonalSign from 'components/wallet/personal_sign'
import { getUnixtime } from 'helper/time';
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

        let wallet_address = '';
        if (wallet) {
            wallet_address = wallet.address;
        }
        let msgstr = JSON.stringify({
            'action_name' : 'login',
            'site'        : 'manestudio',
            'create_time' : getUnixtime(),
            'wallet_address' : wallet_address
        });
        console.log('msgstr',msgstr);

        return <PageWrapper>
            <Head>
                <title>ManeStudio</title>
            </Head>
            <MustLoginWrapper>
            <div className="">


            </div>
            </MustLoginWrapper>
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

