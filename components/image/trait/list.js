import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import autobind from 'autobind-decorator'

import { connect } from "react-redux";
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import TraitOne  from 'components/image/trait/one'
import {uploadRequest} from 'helper/http'
import Upload from 'components/common/upload'


import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadTraitList,deleteTrait,updateTrait,addTrait} from 'redux/reducer/image/trait'
import {imageTraitListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'
import {PuzzleIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'

import { PlusIcon } from '@heroicons/react/solid';
import Button from 'components/common/button';


@withTranslate
class TraitList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_item : null,
            probability_modal : false
        }
        this.wapperRef = React.createRef();
        this.handleUpload = ::this.handleUpload
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

    // @autobind
    // toggleProbabilityModal() {
    //     this.setState({
    //         'probability_modal' : !this.state.probability_modal
    //     })
    // }

    async handleUpload(data) {
        console.log('debug04,data',data)
        await this.props.addTrait({
            img_id : data.data.img_id,
            layer_id : this.props.layer_id
        })

        this.props.refresh();
    }

    render() {

        let {list_data_one,list_rows,grid_span} = this.props;
        // let {show_create_modal} = this.state;
        const {t} = this.props.i18n;

        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        const uploadProps = uploadRequest({
            showUploadList : true,
            multiple: true,
            action: '/v1/upload/img?template=gallery',
            name : 'file',
            listType : 'picture',
            accept : '.jpg,.jpeg,.png,.gif',
        })

        return <div>
            {
                (list_data_one.get('is_fetching'))
                ? <div className="my-16"><Loading /></div>
                : null
            }

            {
                (is_empty)
                ? <div className='py-12 max-w-screen-md mx-auto my-0 text-center'>
                    <Empty text={t('no trait yet')} icon={<PuzzleIcon className='icon-base'/>}/>
                </div>
                : <div className="grid grid-cols-4 gap-4">

                    {
                        (list_data_one.get('is_fetched'))
                        ? <>
                            {
                                list_rows.map((one)=>{
                                    console.log('debug08,one',one)
                                    return <TraitOne 
                                        trait={one} 
                                        refreshList={this.props.refresh}
                                        handleDelete={this.props.deleteTrait}
                                        handleUpdate={this.props.updateTrait}
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

            <div className='flex justify-between'>
                <div>

                </div>
                <Upload uploadProps={uploadProps} afterSuccess={this.handleUpload}>  
                <button className='btn btn-default capitalize'>
                    <PlusIcon className='icon-xs mr-2'/>
                    {t('add trait')}
                </button>
                </Upload>
            </div>
            

            <div>
            </div>
        </div>;

    }



    
}

function mapStateToProps(state,ownProps) {
    
    let layer_id = ownProps.layer_id;
    let list_data_one = state.getIn(['image_trait','list',layer_id]) ? state.getIn(['image_trait','list',layer_id]) : defaultListData
    let list_rows = denormalize(list_data_one.get('list'),imageTraitListSchema,state.get('entities'));

    return {
        entities        : state.getIn(['entities']),
        list_rows       : list_rows,
        list_data_one   : list_data_one
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

