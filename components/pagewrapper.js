import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import classNames from 'classnames';
import LanguageBtn from 'components/language/btn'
import NavLink from 'components/common/navlink'

import Head from 'next/head'
import Link from 'next/link'
import Logo from 'public/img/logo.svg'

import { MenuIcon} from '@heroicons/react/outline'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import { initApp,setSlider,setGlobalModal } from 'redux/reducer/setting'
import {withTranslate} from 'hocs/index'

import { HomeIcon,PlusCircleIcon , CashIcon , CogIcon,InboxInIcon} from '@heroicons/react/outline';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
        // this.props.initApp();
    }

    @autobind
    toggleSider() {
        const {slider} = this.props;
        this.props.setSlider(!slider)
    }


    render() {

        const {t} = this.props.i18n;

        /*<div onClick={this.toggleSider} className="md:hidden py-4 mr-2">
            <MenuIcon className='icon-sm text-gray-800 dark:text-gray-200'/>
        </div>*/

        return (
            <div className="fullpage-container">
                <Head>
                    <title>Zkpayroll</title>
                    <link href="/img/icons/favicon.png" rel="icon" type="image/x-icon" />
                </Head>
                <div>

                    <div className="h-screen w-screen overflow-hidden flex justify-between bg-gray-50">

                        <div className="bg-white w-64 flex flex-col justify-between">

                            <div>

                                <Link href="/">
                                    <a className="flex justify-center my-6 p-2 ">
                                        <Logo className="w-36 pb-4 border-b border-gray-200"/>
                                    </a>
                                </Link>

                                <div className='left-menu'>
                                    <NavLink href="/">
                                    <div className='menu-one'>
                                        <HomeIcon className='icon'/>
                                        <span className='text'>{t('home')}</span>
                                    </div>
                                    </NavLink>
                                    <NavLink href="/safebox">
                                    <div className='menu-one'>
                                        <PlusCircleIcon className='icon'/>
                                        <span className='text'>{t('my safebox')}</span>
                                    </div>
                                    </NavLink>
                                    <NavLink href="/deposit">
                                    <div className='menu-one'>
                                        <InboxInIcon className='icon'/>
                                        <span className='text'>{t('deposit')}</span>
                                    </div>
                                    </NavLink>
                                    <NavLink href="/safebox/setting">
                                    <div className='menu-one'>
                                        <CogIcon className='icon'/>
                                        <span className='text'>{t('setting')}</span>
                                    </div>
                                    </NavLink>

                                </div>

                                <div className='flex justify-center py-4'>
                                    <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon"/>
                                </div>

                            </div>

                            <div className="py-8 flex justify-center">
                                <LanguageBtn />
                            </div>

                            </div>
                                    

                            <div className="flex-grow">
                                <div className={classNames("h-screen","jd-drawer-content","pb-0")}>
                                    {this.props.children}
                                </div>
                            </div>
                            

                    </div>





                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setSlider : (data) => {
            return dispatch(setSlider(data))
        },
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

