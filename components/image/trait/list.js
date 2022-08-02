import React from 'react';
import PropTypes from 'prop-types';
// import Link from 'next/link'
import autobind from 'autobind-decorator'

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import TraitOne  from 'components/image/trait/one'
import {uploadRequest} from 'helper/http'
import Upload from 'components/common/upload'

import {removeValueEmpty} from 'helper/common'
import {getUploadImageUrl} from 'helper/http'

import {withPageList} from 'hocs/index'
import withActiveClub from 'hocs/active_club'

import {loadTraitList,deleteTrait,updateTrait,addTrait} from 'redux/reducer/image/trait'
import {imageTraitListSchema,imageLayerSchema} from 'redux/schema/index'
import {setActiveTraitId} from 'redux/reducer/setting'
import {withTranslate} from 'hocs/index'
import {PuzzleIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'

import { PlusIcon } from '@heroicons/react/solid';
// import Button from 'components/common/button';


@withTranslate
@withActiveClub
class TraitList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_item : null,
        }
        this.wapperRef = React.createRef();
        this.handleUpload = ::this.handleUpload
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
    async handleUpload(layer_id,data) {

        // console.log('debug-upload-fished-handleUpload',layer_id,data);
        
        let result = await this.props.addTrait({
            img_id : data.data.img_id,
            layer_id : layer_id
        })
        console.log('debug-upload-add-trait-finished',result);
        this.props.refresh();
        this.props.setActiveTraitId({
            'group_id' : result.data.group_id,
            'layer_id' : result.data.layer_id,
            'trait_id' : result.data.id
        });
    }

    render() {

        let {list_data_one,list_rows,active_club,active_trait_id,layer_id,group_id,is_lock} = this.props;
        const {t} = this.props.i18n;

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        const uploadProps = uploadRequest({
            showUploadList : true,
            multiple: true,
            action: getUploadImageUrl(active_club),
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        let count = (list_rows) ? list_rows.count() : 0;
        let max_width  = count * 150;

        let uploadFinished = (upload_data)=>{
            // console.log('after-upload-success',layer_id,upload_data);
            this.handleUpload(layer_id,upload_data)
        }

        return <div>
            {
                (list_data_one.get('is_fetching') && list_rows.count() == 0)
                ? <div className="my-16"><Loading /></div>
                : null
            }
            {
                (is_empty)
                ? <div className='max-w-screen-md mx-auto my-0 text-center'>
                    <Upload uploadProps={uploadProps} afterSuccess={uploadFinished} >  
                        <Empty text={t('no trait yet')} icon={<PuzzleIcon className='icon-base'/>} className="py-12"/>
                    </Upload>
                </div>
                : <div className="p-4 pb-0 h-60 w-full overflow-x-auto overflow-y-hidden"><div className='flex justify-start gap-4' style={{width:max_width}}>

                    {
                        (list_rows.count() > 0)
                        ? <>
                            {
                                list_rows.map((one,i)=>{
                                    let is_last = (i == list_rows.count() - 1)
                                    return <TraitOne 
                                        trait={one} 
                                        is_lock={is_lock}
                                        is_selected={(active_trait_id == one.get('id'))}
                                        refreshList={this.props.refresh}
                                        handleDelete={this.props.deleteTrait}
                                        handleUpdate={this.props.updateTrait}
                                        handleEditProbability={this.props.toggleProbabilityModal}
                                        handleEdit={this.edit}
                                        group_id={group_id}
                                        layer_id={layer_id}
                                        is_last={is_last}
                                        setActiveTraitId={this.props.setActiveTraitId}
                                        key={one.get('id')} />
                                })
                            }
                        </>
                        : null
                    }
                </div></div>
            }

            <div className='flex justify-between p-4 '>
                <div>

                </div>
                {
                    (!is_lock)
                    ? <Upload uploadProps={uploadProps} afterSuccess={uploadFinished}>  
                        <button className='btn btn-default capitalize'>
                            <PlusIcon className='icon-xs mr-2'/>
                            {t('add trait')}
                        </button>
                    </Upload>
                    : null
                }
                
            </div>
            


        </div>;

    }



    
}

function mapStateToProps(state,ownProps) {
    
    let layer_id = ownProps.layer_id;
    let list_data_one = state.getIn(['image_trait','list',layer_id]) ? state.getIn(['image_trait','list',layer_id]) : defaultListData
    let list_rows = denormalize(list_data_one.get('list'),imageTraitListSchema,state.get('entities'));

    let layer = denormalize(layer_id,imageLayerSchema,state.get('entities'));
    let active_trait_id = state.getIn(['setting','active_trait',layer.get('group_id'),layer_id]);

    console.log('debug-set-active-trait-get',layer.get('group_id'),layer_id,active_trait_id);


    return {
        entities        : state.getIn(['entities']),
        list_rows       : list_rows,
        list_data_one   : list_data_one,
        active_trait_id : active_trait_id,
        group_id        : layer.get('group_id')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadList   : (cond) => {
            return dispatch(loadTraitList(cond))
        },
        deleteTrait : (trait_id) => {
            return dispatch(deleteTrait(trait_id))
        },
        updateTrait : (trait_id,data) => {
            return dispatch(updateTrait(trait_id,data))
        },
        addTrait : (data) => {
            return dispatch(addTrait(data))
        },
        setActiveTraitId : (data) => {
            return dispatch(setActiveTraitId(data))
        }
    }
}
const formatData = (props) => {
    let result = removeValueEmpty({
        layer_id        : props.layer_id,
    })
    return result;
}

TraitList.propTypes = {
    layer_id     : PropTypes.number
};
  
module.exports = connect(mapStateToProps,mapDispatchToProps,null, {forwardRef: true})(withPageList(TraitList,{'formatData':formatData}))

