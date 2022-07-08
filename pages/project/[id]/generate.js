import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import Immutable from 'immutable';

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
import GenerateFrom from 'components/image/generate/form';
import Loading from 'components/common/loading'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'
import ImageModal from 'components/image/generate/image_modal'

import {httpRequest} from 'helper/http';

import {initTraitList} from 'redux/reducer/image/trait'

import withClubView from 'hocs/clubview'
import Button from 'components/common/button'
import PrefixInput from 'components/form/prefix_input'
// import { list } from 'react-immutable-proptypes';
import { denormalize } from 'normalizr';
import {imageTraitListSchema} from 'redux/schema/index'
//normalize
import Image2 from 'components/image/generate/image2'
import {percentDecimal} from 'helper/number'
// import {imageGenerateListSchema} from 'redux/schema/index'

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
            merged_traits: {},
            filter : [],
            filter_trait_ids : Immutable.List([]),
            preview_id : null,
            preview_index : null,
            uniqueness : 0
        }
        this.loadGenerateList = ::this.loadGenerateList
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.loadGenerateList(this.props.club_id,this.state.filter_trait_ids)
    }

    componentDidUpdate(prevProps,prevState) {
        if (!this.state.filter_trait_ids.equals(prevState.filter_trait_ids)) {
            console.log('发现了不相等');
            this.loadGenerateList(this.props.club_id,this.state.filter_trait_ids)
        }
    }

    
    async loadGenerateList(club_id,filter_trait_ids) {
        this.setState({
            'is_fetching' :  true
        })
        
        let result = await httpRequest({
            'url' : '/v1/image/generate/list_complex',
            'method' : 'GET',
            'data'  : {
                'club_id'      : club_id,
                'trait_ids'    : filter_trait_ids.toJS().join('_')
            }
        })
        // console.log('debug08,result',result);

        this.props.initTraitList(result.data.traits)

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'generates'   : result.data.generates,
            'merged_traits' : result.data.merged_traits,
            'uniqueness'  : result.data.uniqueness
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

    @autobind
    filterOnChange(e) {
        // console.log('filter-change-e',e.target.value)
        // console.log('filter-change',e.target.checked)
        let {filter_trait_ids} = this.state;
        let {value,checked} = e.target;
        if (checked) {
            if (!filter_trait_ids.includes(value)) {
                filter_trait_ids = filter_trait_ids.push(value)
            }
        }else {
            filter_trait_ids = filter_trait_ids.filter(one=>one!=value);
        }
        this.setState({
            'filter_trait_ids' : filter_trait_ids
        })
    }

    @autobind
    setPreview(id,index) {
       this.setState({'preview_id':id,'preview_index':index})
    }

    @autobind
    handleChangeImage(index,data){


        console.log('handleChangeImage-before',index,data);

        const {generates} = this.state;
        generates[index] = data;

        console.log('handleChangeImage-after',generates);

        this.setState({
            'generates' : generates
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_fetching,is_fetched,generates,merged_traits,preview_id,preview_index,uniqueness} = this.state;
        const {club_id,entities} = this.props;


        return <PageWrapper>
            <Head>
                <title>{t('generate nft')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={t('generate nft')} active_id={1}/>

                <ClubStep club_id={club_id} active={2}/>

                <div className='flex justify-between items-center mb-8 max-w-screen-xl mx-auto'>
                    <h1 className='h1'>{t('generate NFT')}</h1>
                    {
                        (generates.length > 0)
                        ? <GenerateFrom club_id={club_id} />
                        : null
                    }
                </div>
                
                <div className="max-w-screen-xl mx-auto grid grid-cols-4 gap-8">

                    <div className="col-span-1">

                    <div class="d-bg-c-1 flex justify-between items-center p-4 mb-4 text-sm">
                        <div class="">{t('unique ratio')}</div>
                        <div class="text-blue-400 font-bold">{percentDecimal(uniqueness)}%</div>
                    </div>

                    {
                        Object.keys(merged_traits).map(k=>{
                            return <div className=' mb-4 d-bg-c-1'>
                                <div className='d-bg-c-1 py-2 px-4 font-bold border-b d-border-c-1'>{k}</div>
                                <div className='px-4 py-2 max-h-36 overflow-y-scroll'>
                                    {
                                        Object.keys(merged_traits[k]).map(k2=>{
                                            return <div className='flex justify-between items-center text-ubuntu my-2 font-sm items-center'>
                                                <div className='flex justify-start items-center text-xs'>
                                                    <input type="checkbox" onChange={this.filterOnChange} value={merged_traits[k][k2]['trait_ids']} class="checkbox-input mr-2" />
                                                    {k2}
                                                </div>
                                                <div className='text-xs text-gray-500'>
                                                    {merged_traits[k][k2]['count']}
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                    </div>

                    <div className="col-span-3">

                        {
                            (is_fetching)
                            ? <div className='py-24 flex justify-center'>
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
                                    (generates.map((one,index)=>{
                                        let traits = denormalize(one.trait_ids_array,imageTraitListSchema,entities);
                                        return <div key={one.id} className="d-bg-c-1 text-sm text-gray-600 dark:text-gray-200">
                                            <Image2 trait_list={traits} index={index} id={one.id}  handlePreview={this.setPreview}/>
                                            <div className='p-2'>#{one.temp_id}</div>
                                        </div>
                                    }))
                                }
                            </div>
                            : null
                        }

                        <div className='grid grid-cols-8 gap-16'>


                        </div>
                    </div>
                </div> 
                <ImageModal visible={(preview_id)?true:false} id={preview_id} index={preview_index} closeModal={this.setPreview.bind({},null)} handleChangeImage={this.handleChangeImage}/>
            </div>
    </PageWrapper>
    }
    
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : Number(query.id)
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
