import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Empty  from 'components/common/empty';
import Loading from 'components/common/loading'
import Pager from 'components/common/pager.js'
import {getHashByData,removeValueEmpty,defaultListData} from 'helper/common'

export default class CommonList extends Component {
    
    constructor(props) {
        super(props)
        
        this.loadListFunction   = null  //获得列表的方法
        
        this.handleEventValueChange = this.handleEventValueChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleCheckboxValueChange = this.handleCheckboxValueChange.bind(this)
        this.changePage = this.changePage.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
        this.refresh = this.refresh.bind(this)
        this.toggleValue = this.toggleValue.bind(this)

        this.refreshKeys = [];
        
        this.itemComponent = null
    }


    // static getDerivedStateFromProps(nextProps, prevState) {

    //     let newState = {}

    //     this.refreshKeys.map(one=>{
    //         if (nextProps[one] != prevState[one]) {
    //             newState[one] = nextProps[one];
    //         }
    //     });

    //     if (Object.keys(newState).length > 0) {
    //         newState['is_fetched'] = false;
    //         newState['is_fetching'] = false;
    //         return newState
    //     }else {
    //         return null
    //     }
    // }

    componentDidMount() {
        console.log('debug:componentDidMount')
        this.loadListFunction(this.formatData(this.state));
    }

    componentDidUpdate(prevProps, prevState) {

        ///
        console.log('debug:componentDidUpdate');


        var a = Immutable.Map(this.formatData(prevState));
        var b = Immutable.Map(this.formatData(this.state));
        if (!a.equals(b)) {
            console.log('debug:formatData不一致',this.state,prevState);
            this.loadListFunction(this.formatData(this.state))
        }

    }

    
    refresh() {
        console.log('刷新数据，this.loadListFunction',this.loadListFunction);
        this.loadListFunction(this.formatData(this.state))
    }

    handleValueChange(key_name,value) {
        var new_state = {}
        new_state[key_name] = value
        this.setState(new_state)
    }

    handleEventValueChange(key_name,event){
        var value = event.target.value;
        var new_state = {}
        new_state[key_name] = event.target.value;
        this.setState(new_state);
    }
    handleCheckboxValueChange(key_name,event){
        var new_state = {}
        new_state[key_name] = event.target.checked;
        this.setState(new_state);
    }

    toggleValue(key_name) {
        var new_state = {}
        new_state[key_name] = !this.state.key_name;
        this.setState(new_state);
    }

    handlePageClick(select) {
        let page = select['selected'] + 1; 
        this.setState({'page':page})
    }

    getLoadingHtml() {
        return <Loading text="正在载入" />
    }

    getEmptyHtml() {
        return <Empty  />
    }

    getPager(data_count) {
        const {page_size} = this.state;

        console.log('debug:getPager',data_count,page_size);
        // if (data_count > page_size) {
            var total_page =  this.getPageNum(data_count);
            return <Pager page_num={total_page} now_page={this.state.page} handlePageClick={this.changePage} />
        // }
        return null;
    }

    getPageNum(data_count) {
        return  Math.ceil(Number(data_count) / this.state.page_size);
    }

    changePage(select) {
        this.setState({'page' : select.selected + 1})
    }
    
    getHash() {
        console.log('debug-hash-origin',this.formatData(this.state));
        return getHashByData(this.formatData(this.state))
    }

    setPage(page) {
        this.setState({
            'page' : page
        })
    }

    getListData(list_data) {
        let hash = this.getHash();
        if (list_data.get(hash)){
            return list_data.get(hash)
        }else {
            return defaultListData
        }
    }

}