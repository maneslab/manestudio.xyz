import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import classNames from 'classnames';
import LanguageBtn from 'components/language/btn'
import Footer from 'components/layout/footer'

import Head from 'next/head'
import Link from 'next/link'
import Logo from 'public/img/logo.svg'
import ConnectWalletButton from 'components/wallet/connect_button'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import { initApp,setSlider,setGlobalModal } from 'redux/reducer/setting'
import {withTranslate} from 'hocs/index'

import config from 'helper/config'
import DarkmodeSwitch from './common/darkmode_switch';

@withTranslate
class PageWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        //initpage
        this.initPage();
    }

    @autobind
    initPage() {
        this.props.initApp();
    }


    render() {

        const {t} = this.props.i18n;
        const {theme,wapperClassName} = this.props;

        /*<div onClick={this.toggleSider} className="md:hidden py-4 mr-2">
            <MenuIcon className='icon-sm text-gray-800 dark:text-gray-200'/>
        </div>*/
        //<ConnectButton showBalance={false} accountStatus="address" chainStatus="icon"/>


        return (
            <div className={classNames("fullpage-container",{"blue":(theme == 'blue')})}>
                <Head>
                    <title>{config.get('NAME')}</title>
                    <link href="/img/favicon.png" rel="icon" type="image/x-icon" />
                </Head>
                <div>

                    <div className="h-screen w-screen overflow-y-auto flex flex-col justify-between">

                        <div className='header-bg text-black mb-8 dark:bg-[#22252b] dark:text-white'>
                        <div className="flex justify-between py-8 h-24 w-full max-w-screen-xl mx-auto ">

                            <div className='flex justify-start'>

                                <Link href="/">
                                    <a className="logo">
                                        <Logo className="h-5 dark:text-white"/>
                                    </a>
                                </Link>

                                <div className='main-menu ml-4'>
                                    <Link href="/project/list"><a className='font-bold capitalize ml-2'>{t('projects')}</a></Link>
                                </div>

                            </div>
                            

                            <div className='flex justify-end items-center'>

                                <div className='mr-2 dark:text-white'>
                                    <DarkmodeSwitch />
                                </div>

                                <LanguageBtn />

                                <ConnectWalletButton />


                            </div>

                        </div>
                        </div>

                        <div className={(wapperClassName) ? wapperClassName : "flex-grow"}>
                            {this.props.children}
                        </div>

                        <Footer />        

                    </div>


                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setGlobalModal : (payload) => {
            return dispatch(setGlobalModal(payload));
        },
        initApp : () => {
            return dispatch(initApp());
        },
    }
}
function mapStateToProps(state,ownProps) {

    let entities = state.get('entities');
    ///注册成功

    let login_user_id = state.getIn(['setting','login_user']);
    let login_user = null;
    if (login_user_id) {
        login_user = denormalize(login_user_id,userSchema,entities)
    }

    return {
        'login_user'  :  login_user,
        'slider'      :  state.getIn(['setting','slider']),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(PageWrapper);

