import React, { Component } from 'react'
import {getHashByData,removeValueEmpty,defaultListData} from 'helper/common'
import Immutable from 'immutable'
export default function withPageList(WrappedComponent,options) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = {
                'page'      : 1,
                'page_size' : (this.props.page_size) ? this.props.page_size : 20,
            }
            this.refresh = ::this.refresh
            this.getHash = ::this.getHash
            this.loadList = ::this.loadList
            this.setPage = ::this.setPage
        }

        componentDidMount() {
            this.loadList(this.formatCondition(this.props,this.state))
        }


        componentDidUpdate(prevProps,prevState) {
            let cond1 =  Immutable.Map(this.formatCondition(this.props,this.state))
            let cond2 =  Immutable.Map(this.formatCondition(prevProps,prevState))
            if (!cond1.equals(cond2)) {
                this.loadList(cond1.toJS())
            }
        }

        formatCondition(origin_props , state) {
            let cond = options.formatData(origin_props)
            cond.page = state.page;
            cond.page_size = state.page_size;
            return cond
        }

        loadList(cond) {
            if (typeof this.props.loadList !== 'function') {
                console.error('使用withPageList时候发现loadList方法不正确,得到的是:',typeof this.props.loadList)
            }
            this.props.loadList(cond);
        }

        
        refresh() {
            this.loadList(this.formatCondition(this.props,this.state))
        }
            
        getHash() {
            // console.log('debug-hash-origin',this.formatCondition(this.props,this.state));
            return getHashByData(this.formatCondition(this.props,this.state))
        }

        setPage(page) {
            this.setState({
                'page' : page
            })
        }

        getListData(list_data) {
            if (!list_data) {
                return defaultListData;
            }
            let hash = this.getHash();
            if (list_data.get(hash)){
                return list_data.get(hash)
            }else {
                return defaultListData
            }
        }

        render() {
          return <WrappedComponent 
            refresh={this.refresh} 
            getHash={this.getHash} 
            getListData={this.getListData} 
            page={this.state.page}
            pageSize={this.state.page_size}
            setPage={this.setPage}
            formData={this.state.form_data}
            {...this.props} />;
        }

    }

}