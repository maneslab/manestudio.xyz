import React from "react";
import classNames from 'classnames'
import NavLink from 'components/common/navlink'
import DarkMode from 'components/other/darkmode'
// import autobind from 'autobind-decorator'

import { HomeIcon,CollectionIcon,UserGroupIcon,UserCircleIcon,SpeakerphoneIcon,ClipboardListIcon} from '@heroicons/react/outline'
import { isMobile } from "react-device-detect";
import {getConfig} from 'helper/config'

// import Discord from 'public/img/social/discord.svg'
// import Twitter from 'public/img/social/twitter.svg'

import {withTranslate} from 'hocs/index'

@withTranslate
class Siderbar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_mobile   : false,
        }
    }

    componentDidMount() {
        this.setState({
            is_mobile : isMobile
        })
    }

    render() {

        const {login_user} = this.props;
        const {t} = this.props.i18n;
        // const {is_mobile} = this.state;

        const env = getConfig('ENV')
        // console.log('publicRuntimeConfig',publicRuntimeConfig)

        let is_super_admin = (login_user && login_user.get('is_super_admin'))
        /*
                            <NavLink href="/about" className="menu-one"  activeClassName="active">
                    <a>
                        <SpeakerphoneIcon className="icon-sm"/>
                        <span className="coll-hidden">{t('about')}</span>
                    </a>
                    </NavLink>

                    <NavLink href="/freewl" className="menu-one"  activeClassName="active">
                    <a>
                        <ClipboardListIcon className="icon-sm"/>
                        <span className="coll-hidden">{t('airdrop')}</span>
                    </a>
                    </NavLink>
                    <NavLink href="/collection/hot" className="menu-one"  activeClassName="active">
                    <a>
                        <CollectionIcon className="icon-sm"/>
                        <span className="coll-hidden">{t('hot collections')}</span>
                    </a>
                    </NavLink>*/
        return (
            <div className={classNames("sider-menu flex flex-col justify-between py-4 h-screen-without-header bg-white dark:bg-gray-800 dark:text-white overflow-y-auto w-60")}>
                <div>

                <div className="mb-8">
                
                    <NavLink href="/" className="menu-one" activeClassName="active">
                    <a>
                        <HomeIcon className="icon-sm"/>
                        <span className="coll-hidden">{t('home')}</span>
                    </a>
                    </NavLink>


                    <NavLink href="/admin/setting" className="menu-one"  activeClassName="active">
                    <a>
                        <UserCircleIcon className="icon-sm"/>
                        <span className="coll-hidden">{t('setting')}</span>
                    </a>
                    </NavLink>



                </div>

                

                {
                    (env == 'local' && true)
                    ?   <div className="mb-8">
                        <h2 className="uppercase text-sm px-4 text-gray-500">{t('management')}</h2>
                        <a className="menu-one" onClick={()=>this.props.fakeLogin('0x19f43E8B016a2d38B483aE9be67aF924740ab893')}>
                            <UserGroupIcon className="icon-sm"/>
                            <span className="coll-hidden">{'测试账号登陆'}</span>
                        </a>
                    </div>
                    : null
                }
                </div>

                <div>
              

                <DarkMode />


                </div>
            </div>
        )
    }
    
}

module.exports = Siderbar
