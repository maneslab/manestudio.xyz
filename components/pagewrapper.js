import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import classNames from 'classnames';
import LanguageBtn from 'components/language/btn'
import GasButton from 'components/common/gas/button'
// import NavLink from 'components/common/navlink'

import Head from 'next/head'
import Link from 'next/link'
import Logo from 'public/img/logo.svg'
import ConnectWalletButton from 'components/wallet/connect_button'
// import WggLogo from 'public/img/wgg_logo.svg'

// import { MenuIcon} from '@heroicons/react/outline'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import { initApp,setSlider,setGlobalModal } from 'redux/reducer/setting'
import {withTranslate} from 'hocs/index'

// import { HomeIcon,PlusCircleIcon , CashIcon , CogIcon,InboxInIcon} from '@heroicons/react/outline';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import config from 'helper/config'

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

    @autobind
    toggleSider() {
        const {slider} = this.props;
        this.props.setSlider(!slider)
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

                    <div className="h-screen w-screen overflow-y-scroll flex flex-col justify-between">

                        <div className='header-bg text-black mb-8'>
                        <div className="flex justify-between py-8 h-24 w-full max-w-screen-xl mx-auto ">

                            <div className='flex justify-start'>

                                <Link href="/">
                                    <a className="logo">
                                        <Logo className="h-5"/>
                                    </a>
                                </Link>

                                <div className='main-menu ml-4'>
                                    <Link href="/project/list"><a className='font-bold capitalize ml-2'>{t('projects')}</a></Link>
                                </div>

                                

                            </div>
                            

                            <div className='flex justify-end items-center'>

                                <GasButton />

                                <LanguageBtn />

                                <ConnectWalletButton />
                            </div>

                        </div>
                        </div>

                        <div className={(wapperClassName) ? wapperClassName : "flex-grow"}>
                            {this.props.children}
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

