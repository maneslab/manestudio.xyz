import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import autobind from 'autobind-decorator'

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import LayerOne  from 'components/image/layer/one'
import UpdateModal  from 'components/image/layer/update_modal'

import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadLayerList,deleteLayer,updateLayer,sortLayer} from 'redux/reducer/image/layer'
import {imageLayerListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'
import {PhotographIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'

import {DndContext,closestCenter,DragOverlay} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';

@withTranslate
class LayerList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_item : null,
            draging_index : null
        }
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
    handleDragStart(event) {
        const {active, over} = event;
        this.setState({
            'draging_index': active.id
        })
    }

    @autobind
    handleDragEnd(event) {
        const {id_list,group_id} = this.props;
        const {active, over} = event;

        if (over) {
            // console.log('debug05,id_list',id_list.toJS());

            // console.log('debug05,handleDragEnd',active,over);

            let begin_index = Number(active.id)
            let end_index = Number(over.id)

            let values = id_list;
            let item = values[begin_index];
            // console.log('debug05,开始前',values)

            values.splice(begin_index, 1);
            // console.log('debug05,中间',values)

            values.splice(end_index, 0, item);
    
            // console.log('debug05,结束以后',values)
            this.props.sortLayer(values,group_id)
    
        }

        this.setState({
            'draging_index': null
        })
    }

    render() {


        let {list_data_one,list_rows,id_list} = this.props;
        const {draging_index} = this.state;
        const {t} = this.props.i18n;

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        return <div>
            {
                (list_data_one.get('is_fetching'))
                ? <div className="my-16"><Loading /></div>
                : null
            }

            {
                (is_empty)
                ? <div className='py-12 max-w-screen-md mx-auto d-bg-c-1 my-0 text-center'>
                    <Empty text={t('no layer yet')} icon={<PhotographIcon className='icon-base'/>}/>
                </div>
                : <div className={""}>
                    {
                        (list_data_one.get('is_fetched'))
                        ? <DndContext
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.handleDragEnd}
                        >
                            <SortableContext items={Object.keys(id_list)}>
                            {
                                list_rows.map((one,index)=>{
                                    return <LayerOne 
                                        layer={one} 
                                        id={index}
                                        draging_index={draging_index}
                                        refreshList={this.props.refresh}
                                        handleDelete={this.props.deleteLayer}
                                        handleUpdate={this.props.updateLayer}
                                        handleEditProbability={this.toggleProbabilityModal}
                                        handleEdit={this.edit}
                                        key={one.get('id')} />
                                })
                            }
                            </SortableContext>
                        </DndContext>
                        : null
                    }
                </div>
            }
            
            <UpdateModal item={this.state.edit_item} closeModal={this.closeEditModal}/>

        </div>;

    }



    
}

function mapStateToProps(state,ownProps) {
    
    let group_id = ownProps.group_id;
    let list_data_one = state.getIn(['image_layer','list',group_id]) ? state.getIn(['image_layer','list',group_id]) : defaultListData
    let list_rows = denormalize(list_data_one.get('list'),imageLayerListSchema,state.get('entities'));

    let list_ids = list_data_one.get('list').toJS();
    Object.keys(list_ids).map((k)=>{
        list_ids[k] = String(list_ids[k])
    })

    return {
        entities        : state.getIn(['entities']),
        list_rows       : list_rows,
        list_data_one   : list_data_one,
        id_list         : list_ids
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadList   : (cond) => {
            return dispatch(loadLayerList(cond))
        },
        deleteLayer : (layer_id) => {
            return dispatch(deleteLayer(layer_id))
        },
        updateLayer : (layer_id,data) => {
            return dispatch(updateLayer(layer_id,data))
        },
        sortLayer  : (data,group_id) => {
            return dispatch(sortLayer(data,group_id))
        },
        
    }
}
const formatData = (props) => {
    console.log('debug030,props',props);
    let result = removeValueEmpty({
        group_id        : props.group_id,
    })
    return result;
}

LayerList.propTypes = {
    group_id     : PropTypes.number
};
  
module.exports = connect(mapStateToProps,mapDispatchToProps,null,{forwardRef:true})(withPageList(LayerList,{'formatData':formatData}))

