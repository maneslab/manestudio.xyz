import React from 'react';
import classNames from 'classnames'
import {RefreshIcon} from '@heroicons/react/outline'
import { connect } from "react-redux";
import { httpRequest } from 'helper/http';
import Loading from 'components/common/loading'

import {PhotographIcon} from '@heroicons/react/outline'
import withTranslate from 'hocs/translate';

@withTranslate
class GenerateImage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            is_fetched  : false,
            trait_list : []
        }
        this.fetchTraits = ::this.fetchTraits
    }

    componentDidMount() {
        this.fetchTraits();
    }

    componentDidUpdate(prevProps) {
        if (this.props.select_traits && !this.props.select_traits.equals(prevProps.select_traits)){
            this.fetchTraits();
        }
    }

    async fetchTraits(){

        const {select_traits,group_id} = this.props;
        
        // console.log('debug01,group_id',group_id);

        this.setState({
            'is_fetching' : true
        })

        let select_traits_str = '';
        if (select_traits) {
            select_traits_str = JSON.stringify(select_traits.toJS())
        }

        let result = await httpRequest({
            'url' : '/v1/image/trait/get_list_by_group',
            'method' : 'GET',
            'data'  : {
                'group_id'      : group_id,
                'select_traits' : select_traits_str
            }
        })
        // console.log('debug01,result',result);

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'trait_list'  : result.data
        })

    }

    render() {

        const {trait_list,is_fetching,is_fetched} = this.state;
        const {t} = this.props.i18n;

        // console.log('trait_list',trait_list)

        return <div className='mb-12'>
            <div className='flex justify-between items-center'>
                <h2 className='h2'>{t('preview')}</h2>
                <button className='btn btn-default' onClick={this.fetchTraits} disabled={is_fetching}> 
                    <RefreshIcon className={classNames('h-4 w-4 mr-2',{'animate-spin':is_fetching})}/>
                    {t('random')}
                </button>
            </div>
            <div className='relative aspect-square mt-4'>
                {trait_list.map(one=>{
                    return <img src={one['img']['image_urls']['url']} key={one.id} className="absolute left-0 top-0"/>
                })}
                {
                    (is_fetching)
                    ? <>
                        <div className='bg-white opacity-75 absolute left-0 top-0 w-full h-full'>
                        </div>
                        <div className='absolute inset-y-1/2 w-full justify-center'>
                            <Loading />
                        </div>
                    </>
                    : null
                }
                {
                    (is_fetched && trait_list.length == 0)
                    ? <div className='bg-gray-400 opacity-20 absolute left-0 top-0 w-full h-full'>
                        <div className='absolute inset-y-1/2 w-full justify-center items-center flex'>
                            <PhotographIcon className="h-12 w-12" />
                        </div>
                    </div>
                    : null
                }
                
            </div>
            
        </div>
    }
    
}

function mapStateToProps(state,ownProps) {
    let select_traits = state.getIn(['setting','active_trait',Number(ownProps.group_id)]);

    return {
        select_traits : select_traits
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      
    }
}
module.exports = connect(mapStateToProps,mapDispatchToProps)(GenerateImage)