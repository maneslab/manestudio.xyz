import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import classNames from 'classnames';
import ConnectBtn from 'components/wallet/connect_btn'
import ConnectModal from 'components/wallet/connect_modal'
import ClubSelect from 'components/club/select'
import LanguageBtn from 'components/language/btn'

import { ethers } from "ethers";

import Head from 'next/head'
import Link from 'next/link'

import { MenuIcon,UserGroupIcon} from '@heroicons/react/outline'

import { denormalize } from 'normalizr';
import { userSchema,clubSchema } from 'redux/schema/index'
import { initApp,setSlider,setGlobalModal } from 'redux/reducer/setting'

class PageWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        //initpage
        this.initPage();

        //
        this.listenNetworkChange();

    }


    listenNetworkChange() {

        if (typeof window.ethereum !== 'undefined') {

            ethereum.on('accountsChanged', (accounts) => {
                console.log('account changed',accounts);
                this.logoutUser();
            });

            // The "any" network will allow spontaneous network changes
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            provider.on("network", (newNetwork, oldNetwork) => {
                if (oldNetwork) {
                    window.location.reload();
                }
            });
        }

    }

    @autobind
    logoutUser() {
        const {login_user} = this.props;
        if (login_user) {
            console.log('调用logout前loginuser是',login_user);
            this.props.logoutUser();
        }
    }

    @autobind
    initPage() {
        this.props.initApp();
        // initPage('login_user',{},store.dispatch,req.cookies)
    }

    @autobind
    fakeLogin(address) {
        this.props.fakeLoginUser({'address':address})
    }

    @autobind
    toggleSider() {
        const {slider} = this.props;
        this.props.setSlider(!slider)
    }


    render() {

        const {active_club} = this.props;

        console.log('active_club',active_club)


        return (
            <div className="fullpage-container">
                <Head>
                    <link href="/img/icons/favicon.png" rel="icon" type="image/x-icon" />
                </Head>
                <div>
                            

                    <div className="h-screen w-screen overflow-hidden">
                        <div className="mt-14" >
                            <div className={classNames("h-screen-without-header","jd-drawer-content","pb-0")}>
                                {this.props.children}
                            </div>
                        </div>
                    </div>

                    <ConnectModal />

                    <div className="bg-white dark:bg-gray-700 dark:border-b dark:border-black h-14 px-4 flex justify-start shadow fixed w-full top-0 z-100">

                        <div onClick={this.toggleSider} className="md:hidden py-4 mr-2">
                            <MenuIcon className='icon-sm text-gray-800 dark:text-gray-200'/>
                        </div>

                        <Link href="/">
                            <a className="logo">
                                <UserGroupIcon className='icon-sm mr-2 text-gray-800'/>
                                Tinyclub
                            </a>
                        </Link>

                        <div className="flex justify-end items-center flex-grow">
                            <LanguageBtn />
                            <ConnectBtn />
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
        fakeLoginUser : (payload) => {
            return dispatch(fakeLoginUser(payload));
        },
        initApp : () => {
            return dispatch(initApp());
        },
        logoutUser : () => {
            return dispatch(logoutUser());
        }
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

    let active_club_id = state.getIn(['setting','active_club_id']);
    let active_club = null;
    if (active_club_id) {
        active_club = denormalize(active_club_id,clubSchema,entities)
    }

    return {
        'login_user'  :  login_user,
        'slider'      :  state.getIn(['setting','slider']),
        'active_club' :  active_club
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(PageWrapper);

