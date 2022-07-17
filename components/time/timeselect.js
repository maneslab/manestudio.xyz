import React from 'react';
import Dropdown from 'rc-dropdown';

import 'react-day-picker/dist/style.css';
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import { format,getUnixTime,fromUnixTime } from 'date-fns';
import {formatOverflowUnixtime} from 'helper/time';

import TimeSelect from 'components/common/time_select';
import { CalendarIcon } from '@heroicons/react/outline';

@withDropdown
@withTranslate
class TimeSelectComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    confirm() {

    }

    render() {
        const {dropdown_visible} = this.props;
        let {value} = this.props;
        const {t} = this.props.i18n;

        value = formatOverflowUnixtime(value);

        const select_date = fromUnixTime(value);
        let menu = <TimeSelect value={value} onChange={this.props.handleValueChange} toggleDropdown={this.props.toggleDropdown}/>

       
        return <Dropdown
                overlay={menu} visible={dropdown_visible}
            >
                <div onClick={this.props.toggleDropdown} className="flex justify-start cursor-pointer">
                {
                    (select_date)
                    ? <span className="text-sm flex items-center px-4 py-2 border-2 border-black dark:border-[#797d86] w-64">
                        <div className="">
                            {format(select_date,'yyyy-MM-dd HH:mm')}
                            <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
                        </div>
                    </span>
                    : <span className="text-sm text-gray-400">{t('please select date')}</span>
                }
                <span className='bg-black dark:bg-[#797d86] text-white p-2 px-4'><CalendarIcon className='icon-sm'/></span>
                </div>
        </Dropdown>



    }
}


export default TimeSelectComponent


