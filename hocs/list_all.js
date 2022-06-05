import React, { Component } from 'react'
import {getHashByData,removeValueEmpty,defaultListData} from 'helper/common'
import Immutable from 'immutable'

export default function withPageListAll(WrappedComponent,options) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = {
            }
            this.refresh = ::this.refresh
            this.getHash = ::this.getHash
            this.loadList = ::this.loadList
        }

        componentDidMount() {
            if (options.autoload !== false) {
                this.loadList(this.formatCondition(this.props))
            }
        }

        componentDidUpdate(prevProps,prevState) {
            if (options.autoload !== false) {
                let cond1 =  Immutable.Map(this.formatCondition(this.props,this.state))
                let cond2 =  Immutable.Map(this.formatCondition(prevProps,prevState))
                if (!cond1.equals(cond2)) {
                    this.loadList(cond1.toJS())
                }
            }
        }
        
        formatCondition(origin_props) {
            return options.formatData(origin_props)
        }

        loadList(cond) {
            if (typeof this.props.loadList !== 'function') {
                console.error('使用withPageListAll时候发现loadList方法不正确,得到的是:',typeof this.props.loadList)
            }
            this.props.loadList(cond);
        }


        refresh() {
            this.loadList(this.formatCondition(this.props))
        }
            
        getHash() {
            return getHashByData(options.formatData(this.props))
        }

        getListData(list_data) {
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
            {...this.props} />;
        }

    }

}