import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import SpecialThree  from 'components/image/special/three'

import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadSpecialList} from 'redux/reducer/image/special'
import {imageSpecialListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'

import {defaultListData} from 'helper/common'


@withTranslate
class ImageSpecialList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.wapperRef = React.createRef();
        console.log('debug11');
    }

    
    render() {

        let {list_data_one,list_rows,show,select_special_nft_ids,only_selected} = this.props;

        console.log('debug11,show',show)

        if (!show) {
            return null;
        }

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        let total_number = 0;
        list_rows.map(one=>{
            total_number += Number(one.get('generate_number'))
        })

        if (!is_empty && !list_data_one.get('is_fetching')) {
            return <>
                {
                    list_rows.map((one)=>{
                        let is_selected = select_special_nft_ids.includes(one.get('id'))
                        if (only_selected && !is_selected) {
                            return null;
                        }
                        return <SpecialThree
                            special={one} 
                            is_selected={is_selected}
                            refreshList={this.props.refresh}
                            handleSelect={this.props.handleSelect}
                            key={one.get('id')} />
                    })
                }
            </>
        }else if (list_data_one.get('is_fetching')) {
            return <Loading />
        }else {
            return null
        }

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
            console.log('载入特殊NFT',cond);
            return dispatch(loadSpecialList(cond))
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

