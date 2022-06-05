import React from 'react'
import Pagination from 'rc-pagination';

import {ChevronLeftIcon,ChevronRightIcon} from '@heroicons/react/outline'

class Pager extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {page_size,total,page,onChange} = this.props;

        // console.log('debug-Pager',page_size,total,page)

        return (<Pagination onChange={onChange} total={total} current={page}
                 pageSize={page_size} 
                 prevIcon={<ChevronLeftIcon className="item-icon"/>}
                 nextIcon={<ChevronRightIcon className="item-icon" />}
                 hideOnSinglePage={true} 
                 showSizeChanger={false}/>
        )

     
    }
}


export default Pager;