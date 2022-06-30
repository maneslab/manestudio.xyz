import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import SpecialTwo  from 'components/image/special/two'

import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadSpecialList,updateSpecial} from 'redux/reducer/image/special'
import {imageSpecialListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'
import {PhotographIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'

import {ChevronDownIcon,ChevronUpIcon} from '@heroicons/react/outline'


@withTranslate
class ImageSpecialList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_open   : true
        }
        this.wapperRef = React.createRef();
    }

    componentDidMount() {
    }

    @autobind
    toggleOpen() {
        this.setState({
            'is_open' : !this.state.is_open
        })
    }

    render() {

        let {list_data_one,list_rows,total_count} = this.props;
        let {is_open} = this.state;
        const {t} = this.props.i18n;

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        let total_number = 0;
        list_rows.map(one=>{
            total_number += Number(one.get('generate_number'))
        })


        return <div className='bg-white max-w-screen-lg mx-auto mb-4'>
            <div className='font-bold text-base px-4 py-4 border-b border-gray-300 cursor-pointer flex justify-between items-center' onClick={this.toggleOpen}>
                <span>1/1</span>
                {
                    (is_open)
                    ? <ChevronUpIcon className='icon-sm text-gray-400'/>
                    : <ChevronDownIcon className='icon-sm text-gray-400'/>
                }

            </div>
            {
                (is_open)
                ? <div>
                    {
                        (list_data_one.get('is_fetching'))
                        ? <div className="my-16"><Loading /></div>
                        : null
                    }

                    {
                        (is_empty)
                        ? <div className='py-12 max-w-screen-md mx-auto bg-white my-0 text-center'>
                            <Empty text={t('no special NFT yet')} icon={<PhotographIcon className='icon-base'/>}/>
                        </div>
                        : <div className="py-2">

                            {
                                (list_data_one.get('is_fetched'))
                                ? <>
                                    {
                                        list_rows.map((one)=>{
                                            return <SpecialTwo
                                                special={one} 
                                                total_count={total_count}
                                                refreshList={this.props.refresh}
                                                handleUpdate={this.props.updateSpecial}
                                                handleEdit={this.edit}
                                                key={one.get('id')} />
                                        })
                                    }
                                </>
                                : null
                            }
                        </div>
                    }
                </div>
                : null
            }
            

            <div>
            </div>
        </div>;

    }
    
}

function mapStateToProps(state,ownProps) {
    
    let club_id = ownProps.club_id;
    let list_data_one = state.getIn(['image_special','list',club_id]) ? state.getIn(['image_special','list',club_id]) : defaultListData
    let list_rows = denormalize(list_data_one.get('list'),imageSpecialListSchema,state.get('entities'));

    return {
        entities        : state.getIn(['entities']),
        list_rows       : list_rows,
        list_data_one   : list_data_one
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadList   : (cond) => {
            return dispatch(loadSpecialList(cond))
        },
        updateSpecial : (special_id,data) => {
            return dispatch(updateSpecial(special_id,data))
        },
    }
}
const formatData = (props) => {
    let result = removeValueEmpty({
        club_id        : props.club_id,
    })
    return result;
}

ImageSpecialList.propTypes = {
    club_id     : PropTypes.number
};
  
module.exports = connect(mapStateToProps,mapDispatchToProps,null, {forwardRef: true})(withPageList(ImageSpecialList,{'formatData':formatData}))

