import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubIntergration from 'components/club/intergration'
import SuccessModal from 'components/common/success_modal'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import {updateClub} from 'redux/reducer/club'
import config from 'helper/config'

import RoadmapUpdate from 'components/roadmap/update'
import GalleryUpdate from 'components/gallery/update'
import CreatorUpdate from 'components/creator/update'

import ClubUpdate from 'components/club/update'
import withClubView from 'hocs/clubview'
import Switch from 'rc-switch';
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
            show_success_modal : false
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
    toggleSuccessModal() {
        this.setState({
            show_success_modal : !this.state.show_success_modal
        })
    }

    @autobind
    toggleCreateModal() {
        this.setState({
            show_create_modal : !this.state.show_create_modal
        })
    }

    @autobind
    onPublicChange(value) {
        console.log('onPublicChange',value);
        this.setState({
            'is_public' :  value
        })
        this.props.updateClub(this.props.club_id,{
            'is_public': value ? 1: 0
        })
        if (value == true) {
            this.toggleSuccessModal();
        }
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


    @autobind
    getManespacePageUrl() {
        let mane_space_url  = config.get('SPACE_WEBSITE');
        const {club_id} = this.props;
        let url = `${mane_space_url}/project/${this.props.club_id}`;
        return url;
    }


    render() {
        const {t,lang} = this.props.i18n;
        const {is_public,preview_link} = this.state;
        const {club,club_id} = this.props;

        let mane_space_url = this.getManespacePageUrl();
        let ropalties_url = (lang=='zh')?'https://docs.manestudio.xyz/v/jian-ti-zhong-wen/gong-neng-shou-ce/she-zhi-ban-shui' : 'https://docs.manestudio.xyz/functions-explained/setting-up-royalties';

        // console.log('mane_space_url',mane_space_url)

        if (!club) {
            return null;
        }

        return <PageWrapper>
            <Head>
                <title>{t('minting page')}</title>
            </Head>
            <div>
                <ClubHeader club={club}  title={t('minting page')} active_id={3} intro={t('minting-page-intro')}/>

                <div className="max-w-screen-xl mx-auto pb-32">


                    <div className='flex justify-between items-center mb-4 '>
                        <h2 className='h2'>{t('settings')}</h2>
                    </div>
                    
                    <ClubUpdate club={club} updateClub={this.props.updateClub}/>

                    <GalleryUpdate club={club} />

                    <CreatorUpdate club={club} />

                    <RoadmapUpdate club={club} />

                    <ClubIntergration club={club} />

                    <div className='fixed bottom-0 left-0 w-full py-4 d-bg-c-1 border-t d-border-c-1' style={{'zIndex':9999}}>
                        <div className='max-w-screen-xl mx-auto flex justify-between items-center'>
                            <div className='flex items-center'>
                                {
                                    (is_public)
                                    ? <div>
                                        <a class="btn btn-ghost text-red-500 ml-2" onClick={this.onPublicChange.bind({},false)}>
                                        <span className='normal-case'>{t('hide in ManeSPACE')}</span>
                                        </a>
                                    </div>
                                    : null
                                }
                            </div>
                            <div>
                            {
                                (!club || !club.get('contract'))
                                ? <div class="tooltip" data-tip={t('you need setting contract first before preview drop page')}>
                                    <button class="btn btn-default" disabled>{t('preview')}</button>
                                </div>
                                : <a className='btn btn-default' href={preview_link} target="_blank">
                                   <span className='normal-case'>{(is_public)?t('open in ManeSPACE'):t('preview')}</span> 
                                </a>
                            }
                            {
                                (!is_public) 
                                ? <a class="btn btn-primary ml-2" onClick={this.onPublicChange.bind({},true)}>
                                    <span className='normal-case'>{t('publish to ManeSPACE')}</span>
                                </a>
                                : null
                            }
                            </div>
                        </div>
                    </div>
                </div> 

                <SuccessModal 
                    visible={this.state.show_success_modal} 
                    closeModal={this.toggleSuccessModal} 
                    title={t('All set')} 
                    desc={t('mint-page-success-desc')} 
                    desc2={t('mint-page-success-desc2')}
                    link_target="_blank"
                    link_text={t('go to ManeSPACE mint page')} 
                    link_href={mane_space_url}
                    link_target2="_blank"
                    link_text2={t('Set Up Royalties')} 
                    link_href2={ropalties_url}
                     />

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
