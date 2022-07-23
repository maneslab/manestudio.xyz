import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import Link from 'next/link'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ContractStep from 'components/contract/step'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import {updateClub} from 'redux/reducer/club'
import config from 'helper/config'

import withClubView from 'hocs/clubview'
import message from 'components/common/message'
import { httpRequest } from 'helper/http';

@withTranslate
@withMustLogin
@withClubView
class ClubDropSetting extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_public : false,
            preview_link : '',
        }
    }

    componentDidMount() {
        if (this.props.club) {
            this.setState({
                'is_public' : Number(this.props.club.get('is_public'))
            })
            this.getPreviewPageUrl();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.club && !this.props.club.equals(prevProps.club)) {
            this.setState({
                'is_public' : Number(this.props.club.get('is_public'))
            })
            this.getPreviewPageUrl();
        }
    } 


    @autobind
    toggleCreateModal() {
        this.setState({
            show_create_modal : !this.state.show_create_modal
        })
    }

    @autobind
    onPublicChange(value) {
        this.setState({
            'is_public' :  value
        })
        this.props.updateClub(this.props.club_id,{
            'is_public': value ? 1: 0
        })
    }

    async fetchClubKey(club_id) {
        
        let result;
        try {
            result = await httpRequest({
                'url' : '/v1/club/key',
                'method' : 'GET',
                'data'  : {
                    'id'      : club_id,
                }
            })
        }catch(e) {
            console.log('debug00,result',e)
            if (e.status == 'error') {
                message.error(e.messages.join(','))
            }
            return '';
        }

        return result.data.public_key;

    }

    @autobind
    async getPreviewPageUrl() {
        let mane_space_url  = config.get('SPACE_WEBSITE');
        const {club_id} = this.props;

        let club_key = await this.fetchClubKey(club_id);

        let url = `${mane_space_url}/project/${this.props.club_id}?key=${club_key}`;


        this.setState({
            'preview_link' : url
        })

    }

    render() {
        const {t} = this.props.i18n;
        const {club_id,club} = this.props;



        return <PageWrapper>
            <Head>
                <title>{'Drop details'}</title>
            </Head>
            <div>
                
                <ClubHeader club={club} title={t('smart contract')} active_id={2} intro={null} />

                <ContractStep club_id={club_id} active_name={'deploy'} next_step={false} />

                <div className="max-w-screen-sm mx-auto pb-32">

                    <div>
                        <h2 className='h2'>{t('choose network to deploy')}</h2>
                        <div className='d-bg-c-1 my-4'>
                            <div className='flex justify-between p-4 border-b d-border-c-2 items-center'>
                                <div>{'Kovan Testnet'}</div>
                                <Link href={"/project/"+club_id+"/deploy?net=kovan"}>
                                <a className='btn btn-primary'>
                                    {t('deploy')}
                                </a>
                                </Link>
                            </div>
                            <div className='flex justify-between p-4 items-center'>
                                <div>{'Eth Mainnet'}</div>
                                <Link href={"/project/"+club_id+"/deploy?net=mainnet"}>
                                <a className='btn btn-primary'>
                                    {t('deploy')}
                                </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                   
                </div> 
            </div>
    </PageWrapper>
    }
    
}

ClubDropSetting.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        updateClub : (id,data) => {
           return dispatch(updateClub(id,data))
        },
    }
}
function mapStateToProps(state,ownProps) {
   return {
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(ClubDropSetting)
