import React from 'react';
import { Field } from 'formik';
// import Dropdown from 'rc-dropdown';

import 'react-day-picker/dist/style.css';
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import { format,getUnixTime,fromUnixTime } from 'date-fns';

import TimeSelect from 'components/common/time_select';
import { CalendarIcon } from '@heroicons/react/outline';
import DropdownComponent from 'components/common/dropdown';

@withDropdown
@withTranslate
class ExpiretimeSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            select_date : null,
            select_hour : null,
            select_minute : null
        }
    }   

    confirm() {

    }

    render() {
        const {label,name,dropdown_visible} = this.props;
        const {t} = this.props.i18n;

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
                let show_error = meta.touched && meta.error;
                const select_date = fromUnixTime(value);

                let menu = <TimeSelect value={value} onChange={setFieldValue.bind({},name)} toggleDropdown={this.props.toggleDropdown}/>
                return <div>
                    <DropdownComponent menu={menu}>
                        <div className="flex justify-start cursor-pointer">
                            {
                                (select_date)
                                ? <span className="text-sm flex items-center px-4 py-2 border-2 border-black dark:border-[#797d86]">
                                    <div className="">
                                        {format(select_date,'yyyy-MM-dd HH:mm')}
                                        <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
                                    </div>
                                </span>
                                : <span className="text-sm text-gray-400">{t('please select date')}</span>
                            }
                            <span className='bg-black dark:bg-[#797d86] text-white p-2 px-4'><CalendarIcon className='icon-sm'/></span>
                            </div>
                    </DropdownComponent>
                    {
                        (show_error)
                        ? <div className="input-error-msg">{meta.error}</div>
                        : null
                    }
                </div>
            }}
        </Field>
        </div>


    }
}


export default ExpiretimeSelect


