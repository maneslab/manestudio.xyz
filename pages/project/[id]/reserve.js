import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import Immutable from 'immutable';
import classNames from 'classnames';

import Button  from 'components/common/button'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
// import GenerateFrom from 'components/image/generate/form';
import Loading from 'components/common/loading'
import SpecialNftList from 'components/image/special/reserve_list'
import SuccessModal from 'components/common/success_modal'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import {httpRequest} from 'helper/http';

import {initTraitList} from 'redux/reducer/image/trait'

import withClubView from 'hocs/clubview'
import { denormalize } from 'normalizr';
import {imageTraitListSchema} from 'redux/schema/index'
import Image2 from 'components/image/generate/image2'
import message from 'components/common/message'

import {CheckIcon} from '@heroicons/react/outline'
import Switch from 'rc-switch';

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
            show_special_nft : true,
            select_nft_ids : Immutable.List([]),
            select_special_nft_ids : Immutable.List([]),
            only_selected : false,
            show_skip_page : true,
            show_success_modal : false
        }
        this.loadGenerateList = ::this.loadGenerateList
        this.saveReserve = ::this.saveReserve
        this.loadReserveList = ::this.loadReserveList
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.loadGenerateList(this.props.club_id,this.state.filter_trait_ids)
        this.loadReserveList(this.props.club_id);
    }

    componentDidUpdate(prevProps,prevState) {
        if (!this.state.filter_trait_ids.equals(prevState.filter_trait_ids)) {
            console.log('发现了不相等');
            this.loadGenerateList(this.props.club_id,this.state.filter_trait_ids)
        }
    }
        
    async loadReserveList(club_id) {
        this.setState({
            'is_fetching_reserve_list' :  true
        })
        
        let result = await httpRequest({
            'url' : '/v1/image/reserve/load',
            'method' : 'GET',
            'data'  : {
                'club_id'      : club_id,
            }
        })
        // console.log('debug08,result',result);

        let show_skip_page = true;
        if (result.data.nft_ids.length > 0 || result.data.sp_nft_ids.length > 0) {
            show_skip_page = false;
        }

        this.setState({
            'is_fetching_reserve_list' : false,
            'select_nft_ids' : Immutable.List(result.data.nft_ids),
            'select_special_nft_ids' : Immutable.List(result.data.sp_nft_ids),
            'show_skip_page'    : show_skip_page
        })
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
    toggleSuccessModal() {
        this.setState({
            'show_success_modal' : !this.state.show_success_modal
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
    showSpecialNft(e) {
        this.setState({
            'show_special_nft' : e.target.checked
        })
    }

    @autobind
    handleChangeImage(index,data){


        // console.log('handleChangeImage-before',index,data);

        const {generates} = this.state;
        generates[index] = data;

        // console.log('handleChangeImage-after',generates);
        this.setState({
            'generates' : generates
        })
    }

    @autobind
    selectNft(id) {
        let {select_nft_ids} = this.state;
        if (!select_nft_ids.includes(id)) {
            select_nft_ids = select_nft_ids.push(id)
        }else {
            select_nft_ids = select_nft_ids.filter(listone=>listone!=id);
        }
        this.setState({
            select_nft_ids : select_nft_ids
        })
    }

    @autobind
    selectSpecialNft(id) {
        let {select_special_nft_ids} = this.state;
        if (!select_special_nft_ids.includes(id)){
            select_special_nft_ids = select_special_nft_ids.push(id)
        }else {
            select_special_nft_ids = select_special_nft_ids.filter(listone=>listone!=id);
        }
        this.setState({
            select_special_nft_ids : select_special_nft_ids
        })
    }

    @autobind
    handleChangeOnlySelected(is_only_selected) {
        this.setState({
            'only_selected' : is_only_selected
        })
    }

    @autobind
    toggleShowSkipPage() {
        this.setState({
            'show_skip_page' : !this.state.show_skip_page
        })
    }

    async saveReserve() {
        const {t} = this.props.i18n;
        const {club_id} = this.props;
        const {select_nft_ids,select_special_nft_ids} = this.state;

        this.setState({
            'is_saving' : true
        })

        try {

            let result = await httpRequest({
                'url' : '/v1/image/reserve/save',
                'method' : 'POST',
                'data'  : {
                    'club_id' : club_id,
                    'nft_ids' : select_nft_ids.toJS().join(','),
                    'special_nft_ids' : select_special_nft_ids.toJS().join(',')
                }
            })

            message.success(t('reserve success'));

            this.toggleSuccessModal();

        }catch(e) {
            if (e.status == 'error') {
                message.error(e.messages.join(','));
            }
        }


        this.setState({
            'is_saving' : false
        })

    }
 
    render() {
        const {t} = this.props.i18n;
        const {is_fetching,is_fetched,generates,merged_traits,select_special_nft_ids,show_special_nft,select_nft_ids,show_skip_page,only_selected} = this.state;

        const {club_id,entities,special_nft_count,club} = this.props;

        return <PageWrapper>
            <Head>
                <title>{t('reserve NFT')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={t('reserve NFT')} active_id={1}/>

                <ClubStep club_id={club_id} active_name={'reserve'} project_type={(club)?club.get('project_type'):'use_generator'}/>

                <div className='flex justify-between items-center mb-8  max-w-screen-xl mx-auto border-b d-border-c-1 pb-4'>
                    <h1 className='h1'>{t('reserve NFT')}</h1>
                    {
                        (!show_skip_page)
                        ?   <div>
                            <span className='mr-4 text-sm font-bold'>Only Show Selected</span>
                            <Switch
                            onChange={this.handleChangeOnlySelected}
                            disabled={false}
                            checked={only_selected}
                            />
                        </div>
                        : null
                    }
                    
                </div>

                {
                    (show_skip_page) 
                    ? <div className='text-center my-12'>
                        <div className='text-center mb-8'>
                            <p>{t('You can choose to set aside a portion of the NFT, or of course, you can choose to skip this step')}</p>
                            <p>{t('The reserved NFTs will be automatically deposited to the address of the published contract after the official version of the contract is released')}</p>
                        </div>
                        <div>
                            <div><button className='btn btn-primary' onClick={this.toggleShowSkipPage}>{t('reserve NFT')}</button></div>
                            <div className='py-4'>{t('or')}</div>
                            <div><button className='btn btn-outline' onClick={this.toggleSuccessModal}>{t('skip')}</button></div>
                        </div>
                    </div>
                    :   <div className="max-w-screen-xl mx-auto">

                        <div className="grid grid-cols-4 gap-8">

                            <div className="col-span-1">

                                <h3 className='h3 mb-2'>{t('special nft')}</h3>
                                <div className='mb-4 d-bg-c-1'>
                                    <div className='px-4 py-2 max-h-36'>
                                        <div className='flex justify-between items-center text-ubuntu my-2 font-sm items-center'>
                                            <div className='flex justify-start items-center text-xs'>
                                                <input type="checkbox" onChange={this.showSpecialNft} checked={show_special_nft} class="checkbox-input mr-2" />
                                                special NFTs
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {special_nft_count}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    (club && club.get('project_type') == 'use_generator')
                                    ? <>
                                        <h3 className='h3 mb-2'>{t('filters')}</h3>
                                        {
                                            Object.keys(merged_traits).map(k=>{
                                                return <div className=' mb-4 d-bg-c-1'>
                                                    <div className='d-bg-c-1 py-2 px-4 font-bold border-b d-border-c-2'>{k}</div>
                                                    <div className='px-4 py-2 max-h-36 overflow-y-auto'>
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
                                    </>
                                    : null
                                }
                            </div>

                            <div className="col-span-3 pb-24">

                                {
                                    (is_fetching)
                                    ? <div className='py-24 flex justify-center'>
                                        <Loading />
                                    </div>
                                    : null
                                }


                                {
                                    (is_fetched)
                                    ? <div className="grid grid-cols-6 gap-4">

                                        <SpecialNftList club_id={club_id} only_selected={only_selected} show={show_special_nft} select_special_nft_ids={select_special_nft_ids} handleSelect={this.selectSpecialNft}/>

                                        {
                                            (generates.map((one,index)=>{
                                                let is_selected = select_nft_ids.includes(one.id);
                                                if (only_selected && !is_selected) {
                                                    return null;
                                                }
                                                let traits = denormalize(one.trait_ids_array,imageTraitListSchema,entities);
                                                return <div key={one.id} className="d-bg-c-1 text-sm text-gray-600 dark:text-gray-200 cursor-pointer" onClick={this.selectNft.bind({},one.id)}>
                                                    <Image2 trait_list={traits} index={index} id={one.id} />
                                                    <div className='p-2 flex justify-between'>
                                                        #{one.temp_id}
                                                        {
                                                            (is_selected)
                                                            ?  <div className='bg-primary text-white w-5 h-5 flex justify-center items-center'>
                                                                <CheckIcon className="icon-xs" />
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            }))
                                        }
                                    </div>
                                    : null
                                }


                            </div>
                        </div>
                        <div className='fixed bottom-0 left-0 w-full py-4 d-bg-c-1 border-t d-border-c-1' style={{'zIndex':9999}}>
                            <div className='max-w-screen-xl mx-auto flex justify-between items-center'>
                                <div className='text-sm'>
                                    <div>{select_nft_ids.count()} {t('generated NFT selected')}</div>
                                    <div>{select_special_nft_ids.count()} {t('sepecial NFT selected')}</div>
                                </div>
                                <div className='flex justify-end items-center'>
                                    <Button onClick={this.saveReserve} loading={this.state.is_saveing} className='btn btn-primary -ml-1'>{t('confirm reserve')}</Button>
                                </div>
                            </div>
                        </div>
                    </div> 
                }
                
                <SuccessModal visible={this.state.show_success_modal} closeModal={this.toggleSuccessModal} title={t('Congratulations!')} desc={t('you have finished generate NFT ,now you can goto contract page for build your NFT contract now!')} link_text={t('goto contract page')} link_href={'/project/'+club_id+'/contract'} />

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

    let club_id = ownProps.club_id;
    let special_nft_count = state.getIn(['image_special','list',club_id,'list']) ? state.getIn(['image_special','list',club_id,'list']).count() : 0;

    return {
        'special_nft_count' : special_nft_count,
        'entities'          : state.get('entities')
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GenerateGroupView)
