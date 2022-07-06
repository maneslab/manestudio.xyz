import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator';

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ClubStep from 'components/club/step'
import Loading from 'components/common/loading'
import SpecialNftMetadataList from 'components/image/special/metadata'

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';
import withSetActiveClub from 'hocs/set_active_club'
import withActiveClub from 'hocs/active_club'

import {httpRequest} from 'helper/http';


import withClubView from 'hocs/clubview'
import {percentDecimal} from 'helper/number'

import { ChevronDownIcon,ChevronUpIcon } from '@heroicons/react/outline';

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
            data : {},
            count : 0
        }
        this.loadMetadata = ::this.loadMetadata
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.loadMetadata(this.props.club_id)
    }

    async loadMetadata(club_id) {
        this.setState({
            'is_fetching' :  true
        })
        
        let result = await httpRequest({
            'url' : '/v1/image/trait/metadata',
            'method' : 'GET',
            'data'  : {
                'club_id'      : club_id,
            }
        })
        console.log('debug08,result',result);

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'data'   : result.data.metadata,
            'count'  : result.data.count
        })
    }

    render() {
        const {t} = this.props.i18n;
        const {is_fetching,is_fetched,data,count} = this.state;
        const {club_id} = this.props;


        return <PageWrapper>
            <Head>
                <title>{t('metadata')}</title>
            </Head>
            <div>
                <ClubHeader club_id={club_id} title={'metadata'} active_id={1}/>

                <ClubStep club_id={club_id} active={3}/>

                <div className="max-w-screen-xl mx-auto">
                    {
                        is_fetching ? <Loading/> : null
                    }
                    {
                        is_fetched ? <div>
                            {
                                Object.keys(data).map(k=>{
                                    return <MetadataOne one={data[k]} name={k}  key={k} />
                                })
                            }
                        </div>
                        : null
                    }
                    <SpecialNftMetadataList club_id={this.props.club_id} total_count={count}/>
                    
                </div> 
            </div>
    </PageWrapper>
    }
    
}

class MetadataOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'is_open' : true
        }
    }

    @autobind
    toggleOpen() {
        this.setState({
            'is_open' : !this.state.is_open
        })
    }

    render() {
        const {one,name} = this.props;
        const {is_open} = this.state;
        return <div className="d-bg-c-1 max-w-screen-lg mx-auto mb-4">
            <div className='font-bold text-base px-4 py-4 border-b d-border-c-1 cursor-pointer flex justify-between items-center' onClick={this.toggleOpen}>
                <span>{name}</span>
                {
                    (is_open)
                    ? <ChevronUpIcon className='icon-sm text-gray-400'/>
                    : <ChevronDownIcon className='icon-sm text-gray-400'/>
                }

            </div>
            {
                (this.state.is_open)
                ?   <div className='py-2'>
                    {
                        Object.keys(one).map(k2=>{
                            return <div className='flex justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-[#333]'>
                                <div>{k2}</div>
                                <div className='flex justify-end items-center text-sm'>
                                    <div className='mr-4'>({one[k2]['count']})</div>
                                    <div>{percentDecimal(one[k2]['ratio'])}%</div>
                                </div>
                            </div>
                        })
                    }
                </div>
                : null
            }

        </div>
    }
}

GenerateGroupView.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


export default GenerateGroupView
