import React from 'react';
import { connect } from 'react-redux'
// import autobind from 'autobind-decorator'

// import Loading from 'components/common/loading'
// import Link from 'next/link'
import Head from 'next/head'

import PageWrapper from 'components/custom_layout/page_wapper'
import { setActiveClub } from 'redux/reducer/setting';
import NavLink from 'components/common/navlink'
import Avatar from 'components/avatar/one'
import {withTranslate} from 'hocs/index'
import {UserGroupIcon} from '@heroicons/react/outline'

@withTranslate
class ClubViewWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        if (this.props.club) {
            this.props.setActiveClub(this.props.club.get('id'))
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.club && !this.props.club.equals(prevProps.club)) {
            this.props.setActiveClub(this.props.club.get('id'))
        }
    }


    render() {

        const {club,club_name} = this.props;
        const {t} = this.props.i18n;
        let base_url = '/c/'+club_name


        return (
            <PageWrapper>
            <Head>
                <title>{club ? club.get('name') : 'Tinyclub'}</title>
            </Head>
            <div className='border border-gray-200 bg-white shadow-md h-setting-page md:m-4'>

                {
                    (club)
                    ? <div className=''>
                        
                        <div className='bg-gray-100 py-12 px-4'>

                            <div className='flex justify-center'>
                                <Avatar avatar={club.get('avatar')} size={24}/>
                            </div>

                            <div className='text-center text-lg font-bold capitalize mt-4 mb-8'>
                                {club.get('name')}
                            </div>

                            <div className='block-club-nav'>
                                <ul className='flex justify-center space-x-6'>
                                    <li><NavLink href={base_url} activeClassName="active"><a>{t('home')}</a></NavLink></li>
                                    <li><NavLink href={base_url+'/verify'}><a>discord</a></NavLink></li>
                                    <li><NavLink href={base_url+'/post'}><a>post</a></NavLink></li>
                                </ul>
                            </div>

                        </div>

                        <div className='bg-white px-4 py-12'>
                            {this.props.children}
                        </div>

                    </div>
                    : <div className='py-12'>
                        <div className='flex justify-center mb-4'><UserGroupIcon className='text-blue-500 w-12'/></div>
                        <div className='text-center font-bold text-base uppercase'>{t('club is not exist')}</div>
                    </div>
                }

            </div>
            </PageWrapper>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setActiveClub : (club_id) => {
            return dispatch(setActiveClub(club_id))
        }
    }
}
function mapStateToProps(state,ownProps) {
    return {
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(ClubViewWrapper);

