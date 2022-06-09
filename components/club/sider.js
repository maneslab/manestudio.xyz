import React from "react";
import classNames from 'classnames'
import NavLink from 'components/common/navlink'

import { HomeIcon,DocumentTextIcon,ServerIcon,ChatIcon,CogIcon,UsersIcon} from '@heroicons/react/outline'
import { isMobile } from "react-device-detect";
import {getConfig} from 'helper/config'

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

        const {club_id} = this.props;
        const {t} = this.props.i18n;

        const env = getConfig('ENV');

        if (!club_id) {
            return null;
        }

        /*

                    <NavLink href={"/club/"+id+'/document'} className="menu-one"  activeClassName="active">
                    <a>
                        <AcademicCapIcon className="icon"/>
                        <span className="coll-hidden">{t('Help & Document')}</span>
                    </a>
                    </NavLink>

                    <NavLink href={"/club/"+id+'/links'} className="menu-one"  activeClassName="active">
                    <a>
                        <LinkIcon className="icon"/>
                        <span className="coll-hidden">{t('Links')}</span>
                    </a>
                    </NavLink>
                    
                            <NavLink href="/about" className="menu-one"  activeClassName="active">
                    <a>
                        <SpeakerphoneIcon className="icon"/>
                        <span className="coll-hidden">{t('about')}</span>
                    </a>
                    </NavLink>

                    <NavLink href="/freewl" className="menu-one"  activeClassName="active">
                    <a>
                        <ClipboardListIcon className="icon"/>
                        <span className="coll-hidden">{t('airdrop')}</span>
                    </a>
                    </NavLink>
                    <NavLink href="/collection/hot" className="menu-one"  activeClassName="active">
                    <a>
                        <CollectionIcon className="icon"/>
                        <span className="coll-hidden">{t('hot collections')}</span>
                    </a>
                    </NavLink>*/
        return (
            <div className={classNames("sider-menu py-4 dark:bg-gray-800 dark:text-white overflow-y-auto w-full")}>
                <div className="mb-8">
                
                    <NavLink href={"/club/"+club_id} className="menu-one" activeClassName="active">
                    <a>
                        <HomeIcon className="icon"/>
                        <span className="coll-hidden">{t('home')}</span>
                    </a>
                    </NavLink>


                    <NavLink href={"/club/"+club_id+'/setting'} className="menu-one"  activeClassName="active">
                    <a>
                        <CogIcon className="icon"/>
                        <span className="coll-hidden">{t('setting')}</span>
                    </a>
                    </NavLink>

                    <NavLink href={"/club/"+club_id+'/mint'} className="menu-one" activeClassName="">
                    <a>
                        <DocumentTextIcon className="icon"/>
                        <span className="coll-hidden">{t('contract')}</span>
                    </a>
                    </NavLink>

                    <div className="menu-sub">

                        <NavLink href={"/club/"+club_id+'/mint'} className="menu-one"  activeClassName="active">
                        <a>
                            <ServerIcon className="icon"/>
                            <span className="coll-hidden">{t('mint')}</span>
                        </a>
                        </NavLink>

                        <NavLink href={"/club/"+club_id+'/transfer'} className="menu-one"  activeClassName="active">
                        <a>
                            <UsersIcon className="icon"/>
                            <span className="coll-hidden">{t('transfer')}</span>
                        </a>
                        </NavLink>

                    </div>

                    <NavLink href={"/club/"+club_id+'/log'} className="menu-one" activeClassName="">
                    <a>
                        <ChatIcon className="icon"/>
                        <span className="coll-hidden">{t('discord')}</span>
                    </a>
                    </NavLink>

                    <div className="menu-sub">

                        <NavLink href={"/club/"+club_id+'/log'} className="menu-one"  activeClassName="active">
                        <a>
                            <ServerIcon className="icon"/>
                            <span className="coll-hidden">{t('action log')}</span>
                        </a>
                        </NavLink>

                        <NavLink href={"/club/"+club_id+'/member'} className="menu-one"  activeClassName="active">
                        <a>
                            <UsersIcon className="icon"/>
                            <span className="coll-hidden">{t('member')}</span>
                        </a>
                        </NavLink>

                    </div>

                </div>

            </div>
        )
    }
    
}

module.exports = Siderbar
