import React from 'react';
import Immutable from 'immutable'

import autobind from 'autobind-decorator'

import {getHashByData,removeValueEmpty,defaultListData} from 'helper/common'

class CommonList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            page         : 1,
            page_size    : 15
        }
    }

    componentDidMount() {
        this.loadList(this.formatCondition(this.state))
    }


    componentDidUpdate(prevProps,prevState) {
        let cond1 =  Immutable.Map(this.formatCondition(this.state))
        let cond2 =  Immutable.Map(this.formatCondition(prevState))

        if (!cond1.equals(cond2)) {
            this.loadList(cond1.toJS())
        }
    }


    loadList(cond) {
        this.props.loadList(cond);
    }

    refresh() {
        this.loadList(this.formatCondition(this.state))
    }
        
    getHash() {
        console.log('debug-hash-origin',this.formatCondition(this.state),this.state);
        return getHashByData(this.formatCondition(this.state))
    }

    setPage(page) {
        this.setState({
            'page' : page
        })
    }

    getListData(list_data) {
        let hash = this.getHash();
        console.log('debug-getListData-hash',hash);
        if (list_data.get(hash)){
            return list_data.get(hash)
        }else {
            return defaultListData
        }
    }


    render() {

    }
    
}


module.exports = CommonList
