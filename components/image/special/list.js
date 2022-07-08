import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import autobind from 'autobind-decorator'

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import SpecialOne  from 'components/image/special/one'
import UpdateModal  from 'components/image/special/update_modal'

import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadSpecialList,deleteSpecial,updateSpecial,updateSpecialProbability} from 'redux/reducer/image/special'
import {imageSpecialListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'
import {PhotographIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'

import message from 'components/common/message'


@withTranslate
class ImageSpecialList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_item : null,
        }
        this.wapperRef = React.createRef();
    }

    componentDidMount() {
    }


    @autobind
    edit(item) {
        this.setState({
            'edit_item' : item
        })
    }
    
    @autobind
    closeEditModal() {
        this.setState({
            'edit_item' : null
        })
    }

    @autobind
    toggleProbabilityModal() {
        this.setState({
            'probability_modal' : !this.state.probability_modal
        })
    }

    render() {

        let {list_data_one,list_rows,grid_span} = this.props;
        // let {show_create_modal} = this.state;
        const {t} = this.props.i18n;

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        let total_number = 0;
        list_rows.map(one=>{
            total_number += Number(one.get('generate_number'))
        })

        return <div>
            {
                (list_data_one.get('is_fetching'))
                ? <div className="my-16"><Loading /></div>
                : null
            }

            {
                (is_empty)
                ? <div className='py-12 max-w-screen-md mx-auto d-bg-c-1 my-0 text-center'>
                    <Empty text={t('no special NFT yet')} icon={<PhotographIcon className='icon-base'/>}/>
                </div>
                : <div className={"grid grid-cols-3 gap-4"}>

                    {
                        (list_data_one.get('is_fetched'))
                        ? <>
                            {
                                list_rows.map((one)=>{
                                    return <SpecialOne 
                                        special={one} 
                                        total_number={total_number}
                                        refreshList={this.props.refresh}
                                        handleDelete={this.props.deleteSpecial}
                                        handleUpdate={this.props.updateSpecial}
                                        handleEditProbability={this.toggleProbabilityModal}
                                        handleEdit={this.edit}
                                        key={one.get('id')} />
                                })
                            }
                        </>
                        : null
                    }
                </div>
            }
            
            <UpdateModal item={this.state.edit_item} closeModal={this.closeEditModal}/>


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
        deleteSpecial : (special_id) => {
            return dispatch(deleteSpecial(special_id))
        },
        updateSpecial : (special_id,data) => {
            return dispatch(updateSpecial(special_id,data))
        },
        updateSpecialProbability  : (data) => {
            return dispatch(updateSpecialProbability(data))
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

