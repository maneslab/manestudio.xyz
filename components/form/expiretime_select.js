import React from 'react';
import { Field } from 'formik';
import classNames from 'classnames';

import 'react-day-picker/dist/style.css';
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import { format,getUnixTime,fromUnixTime } from 'date-fns';
import ErrorMessage from 'components/form/error_message'

import TimeSelect from 'components/common/time_select';
import { CalendarIcon } from '@heroicons/react/outline';
// import DropdownComponent from 'components/common/dropdown';

import Dropdown from 'rc-dropdown';

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
        const {label,name,dropdown_visible,setNotice,side_notice} = this.props;
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

                let menu = <div>
                    <TimeSelect value={value} onChange={setFieldValue.bind({},name)} toggleDropdown={this.props.toggleDropdown}/>
                </div>
                return <div>
                    <Dropdown
                        overlay={menu} visible={dropdown_visible}
                    >
                        <div className={classNames("input-with-prefix cursor-pointer w-72",{"has-error":show_error})} 
                            onClick={this.props.toggleDropdown}
                            onMouseEnter={(e)=>{
                                if (typeof setNotice === 'function' && side_notice) {
                                    setNotice(side_notice)
                                } 
                            }}
                            onMouseLeave={(e)=> {
                                if (typeof setNotice === 'function') {
                                    setNotice(null)
                                } 
                            }} 
                        >
                            {
                                (value)
                                ? <span className="input-inner">
                                    <div className="">
                                        {format(select_date,'yyyy-MM-dd HH:mm')}
                                        <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
                                    </div>
                                </span>
                                : <span className="input-inner">
                                    {t('please select date')}
                                    <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
                                </span>
                            }
                            <span className='prefix end h-9 flex items-center'><CalendarIcon className='icon-xs'/></span>
                        </div>
                    </Dropdown>
                    <ErrorMessage name={name}/>
                    {
                        (dropdown_visible)
                        ? <div className='mask-bg' onClick={this.props.toggleDropdown}></div>
                        : null
                    }
                </div>
            }}
        </Field>
        </div>


    }
}


export default ExpiretimeSelect


