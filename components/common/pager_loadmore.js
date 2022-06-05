import React from 'react'
import Button from 'components/common/button';

import {ChevronLeftIcon,ChevronRightIcon} from '@heroicons/react/outline'
import {withTranslate} from 'hocs/index'

@withTranslate
class Pager extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {total,page,onChange} = this.props;
        const {t} = this.props.i18n

        let page_size;
        if (!this.props.page_size) {
            page_size = 20;
        }else {
            page_size = this.props.page_size
        }

        let total_page_count = Math.ceil(total / page_size)

        // console.log('debug.pager',page_size,total,total_page_count,page)

        if (page >= total_page_count) {
            return null;
        }

        return (
            <Button className="btn btn-default w-full" onClick={()=>onChange(page+1)}>{t("load more")}</Button>
        )

     
    }
}


export default Pager;