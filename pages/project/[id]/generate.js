import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
import GenerateFrom from 'components/image/generate/form';
import Loading from 'components/common/loading'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import {httpRequest} from 'helper/http';

import {initTraitList} from 'redux/reducer/image/trait'

import withClubView from 'hocs/clubview'
import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'
import { list } from 'react-immutable-proptypes';
import { denormalize } from 'normalizr';
import {imageTraitListSchema} from 'redux/schema/index'
import Image2 from 'components/image/generate/image2'

@withTranslate
@withMustLogin
@withClubView
@withActiveClub
@withSetActiveClub
class GenerateGroupView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            is_fetched  : false,
            merged_traits : [],
            generates : [],
            merged_traits: {}
        }
        this.loadGenerateList = ::this.loadGenerateList
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.loadGenerateList(this.props.club_id)
    }

    
    async loadGenerateList(club_id) {
        this.setState({
            'is_fetching' :  true
        })
        
        let result = await httpRequest({
            'url' : '/v1/image/generate/list_complex',
            'method' : 'GET',
            'data'  : {
                'club_id'      : club_id,
            }
        })
        console.log('debug08,result',result);

        this.props.initTraitList(result.data.traits)

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'generates'   : result.data.generates,
            'merged_traits' : result.data.merged_traits
        })
    }

    @autobind
    toggleCreateModal() {
        this.setState({
            show_create_modal : !this.state.show_create_modal
        })
    }

    @autobind
    refreshList() {
        if (this.listRef.current) {
            this.listRef.current.refresh();
        }
    }


    render() {
        const {t} = this.props.i18n;
        const {is_fetching,is_fetched,generates,merged_traits} = this.state;
        const {club_id,entities} = this.props;

        console.log('debug08,merged_traits',merged_traits)

        /* Object.keys(merged_traits).map(k=>{
            return <div>
                <div>{merged_traits[k]}</div>
                <div>{
                    Object.keys(merged_traits[k]).map(k2=>{
                        return <div>
                        {k2}
                        </div>
                    })
                }</div>
            </div>
        }) */
        return <PageWrapper>
            <Head>
                <title>{t('generate nft')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={t('generate nft')}/>

                <ClubStep club_id={club_id} active={2}/>
                
                <div className="max-w-screen-xl mx-auto grid grid-cols-4 gap-8">

                    <div className="col-span-1">
                    {
                        Object.keys(merged_traits).map(k=>{
                            return <div className='border border-black mb-4'>
                                <div className='bg-black text-white py-2 px-4'>{k}</div>
                                <div className='px-4 py-2 max-h-36 overflow-y-scroll'>
                                    {
                                        Object.keys(merged_traits[k]).map(k2=>{
                                            return <div className='flex justify-start items-center font-bold text-ubuntu'><input type="checkbox" checked="checked" class="checkbox mr-2" />{k2}</div>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                    </div>

                    <div className="col-span-3">

                        <div className='flex justify-between items-center mb-8 text-black'>
                            <h1 className='h1'>{t('generate NFT')}</h1>
                            {
                                (generates.length > 0)
                                ? <GenerateFrom club_id={club_id} />
                                : null
                            }
                        </div>

                        {
                            (is_fetching)
                            ? <div className='pt-24 flex justify-center'>
                                <Loading />
                            </div>
                            : null
                        }

                        {
                            (is_fetched && generates.length == 0)
                            ? <div className='py-24'>
                                <div className='flex justify-center capitalize font-bold text-xl mb-8'>{t('no item')}</div>
                                <div className='flex justify-center'>
                                    <GenerateFrom club_id={club_id} />
                                </div>
                            </div>
                            : null
                        }
                        {
                            (is_fetched && generates.length > 0)
                            ? <div className="grid grid-cols-6 gap-4">
                                {
                                    (generates.map(one=>{
                                        let traits = denormalize(one.trait_ids,imageTraitListSchema,entities);
                                        return <Image2 trait_list={traits} key={one.id} />
                                            
                                    }))
                                }
                            </div>
                            : null
                        }

                        <div className='grid grid-cols-8 gap-16'>


                        </div>
                    </div>
                </div> 
            </div>
    </PageWrapper>
    }
    
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        initTraitList : (data) => {
            return dispatch(initTraitList(data))
        }
    }
}
function mapStateToProps(state,ownProps) {
    return {
        'entities' : state.get('entities')
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
