import React from 'react';
import { connect } from "react-redux";
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import { Field } from 'formik';
import Immutable from 'immutable';

import Loading from 'components/common/loading'
import Dropdown from 'rc-dropdown';

import {loadCollectionList} from 'redux/reducer/collection'
import {ChevronDownIcon,BadgeCheckIcon} from '@heroicons/react/outline'

import CommonList from 'components/hoc/list'
import {removeValueEmpty} from 'helper/common'
import { denormalize } from 'normalizr';
import { collectionListSchema } from 'redux/schema/index'

class CollectionSelect extends CommonList {

    constructor(props) {
        super(props)
        this.state = {
            'is_fetching'   : false,
            'is_fetched'    : false,
            'dropdown_visible' : false,

            'keyword'       : '',
            'is_verify'     : 1,
        }
        this.loadListFunction = this.props.loadCollectionList;
    }   

    formatData(state) {

        let result;
        if (state.keyword) {
            result = removeValueEmpty({
                page_size       : state.page_size,
                page            : state.page,
                keyword         : state.keyword,
            })
        }else {
            result = removeValueEmpty({
                page_size       : state.page_size,
                page            : state.page,
                is_verify       : state.is_verify,
            })
        }

        return result;
    }

    @autobind
    toggleVisible() {
        this.setState({ dropdown_visible : !this.state.dropdown_visible });
    }

    @autobind
    search() {
        this.loadListFunction(this.formatData(this.state))
    }

    render() {
        const {page,page_size,dropdown_visible} = this.state;
        const {list_data,entities,label,name} = this.props;

        let list_data_one =  this.getListData(list_data)
        let list_rows = denormalize(list_data_one.get('list'),collectionListSchema,entities)

        // console.log('list_rows',list_rows.toJS());
        // console.log('debug-name-input',name);
        /*<Dropdown overlay={<div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                    <ul className="overflow-y-scroll">
                        {
                            list_rows.map(list_one=>{
                                console.log('list_one',list_one)
                                return <li key={list_one.get('id')}>
                                    <a className={"cursor-pointer block text-base py-2 px-4"} 
                                        onClick={()=>{
                                        setFieldValue(name,list_one.get('contract_address'));
                                        this.toggleVisible();
                                    }}>
                                        <span className='text font-bold'>{list_one.get('name')}</span>
                                        <span className='text ml-4 text-sm'>{list_one.get('contract_address')} ETH</span>
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                </div>} visible={dropdown_visible}>
                    <div onClick={()=>{
                        this.setState({'dropdown_visible':!dropdown_visible});
                    }} className="input-box flex justify-between items-center h-10 cursor-pointer" >
                        {
                            (value)
                            ?   <div className="flex flex-start items-center">
                                <span className="sider-a-text">{value}</span>
                            </div>
                            : <span className="text-sm text-gray-400">{'please select background'}</span>
                        }
                        <ChevronDownIcon className="w-4"/>
                    </div>
                </Dropdown>*/
        return  <div className="form-control">
        {
            (label)
            ?   <label className="label">
              <span className="label-text">{label}</span>
            </label> 
            : null
        }
        <Field name={name}>
            {({
               field : { value, onChange, onBlur },
               form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                return <Dropdown overlay={<div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                    <div className="border-b px-2 py-2 flex justify-between">
                        <input className="flex-grow text-base pl-2" onChange={this.handleEventValueChange.bind({},'keyword')}/>
                        <button className="btn btn-primary" onClick={this.search}>search</button>
                    </div>
                    <ul className="overflow-y-scroll">
                        {
                            list_rows.map(list_one=>{
                                // console.log('list_one',list_one)
                                return <li key={list_one.get('id')}>
                                    <a className={"cursor-pointer flex justify-start items-center text-base py-2 px-4"} 
                                        onClick={()=>{
                                            console.log('debug-name',name,list_one.get('contract_address'))
                                        setFieldValue(name,list_one);
                                        this.toggleVisible();
                                    }}>
                                        {(list_one.get('is_verify')) ? <BadgeCheckIcon className="icon-sm text-yellow-400 mr-2"/> : null}
                                        <span className='text font-bold'>{list_one.get('name')}</span>
                                        <span className='text ml-4 text-sm'>{list_one.get('contract_address')}</span>
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                </div>} visible={dropdown_visible}>
                    <div onClick={()=>{
                        this.setState({'dropdown_visible':!dropdown_visible});
                    }} className="input-box flex justify-between items-center h-10 cursor-pointer" >
                        {
                            (value)
                            ?   <div className="flex flex-start items-center">
                                {(value.get('is_verify')) ? <BadgeCheckIcon className="icon-sm text-yellow-400 mr-2"/> : null}
                                <span className='text font-bold'>{value.get('name')}</span>
                                <span className='text ml-4 text-sm'>{value.get('contract_address')}</span>
                            </div>
                            : <span className="text-sm text-gray-400">{'please select contract address'}</span>
                        }
                        <ChevronDownIcon className="w-4"/>
                    </div>
                </Dropdown>
            }}
        </Field>
        </div>


    }
}


const mapDispatchToProps = (dispatch) => {
     return {
        loadCollectionList : (data) => {
            return dispatch(loadCollectionList(data))
        }
     }
}
function mapStateToProps(state,ownProps) {
    return {
        entities        : state.getIn(['entities']),
        list_data       : state.getIn(['collection','list']),
    }
}

export default connect(mapStateToProps,mapDispatchToProps,null,{forwardRef:true})(CollectionSelect)


