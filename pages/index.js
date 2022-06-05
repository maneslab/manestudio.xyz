import React, { useState,useEffect } from 'react';

import {wrapper} from 'redux/store';
import { connect } from "react-redux";
import PageWrapper from 'components/pagewrapper'


import Head from 'next/head'

import { withRouter } from 'next/router'


import {withTranslate} from 'hocs/index'
import {KeyIcon,DatabaseIcon} from '@heroicons/react/outline'
import {ShieldCheckIcon} from '@heroicons/react/outline'
import {StarIcon} from '@heroicons/react/solid'

@withTranslate
@withRouter
class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {t} = this.props.i18n;

        return <PageWrapper>
            <Head>
                <title>ManeStudio</title>
            </Head>
            <div className="">
               <div>TEST</div>

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

