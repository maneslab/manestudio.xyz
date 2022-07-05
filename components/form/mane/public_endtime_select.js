import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';

import 'react-day-picker/dist/style.css';
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import { format,getUnixTime,fromUnixTime } from 'date-fns';

import TimeSelect from 'components/common/time_select';
import { CalendarIcon } from '@heroicons/react/outline';
import FormSwitch from 'components/form/switch';

@withDropdown
@withTranslate
class PublicEndTimeSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            select_date : null,
            select_hour : null,
            select_minute : null
        }
    }   

    render() {
        const {label,name,dropdown_visible,pb_enable} = this.props;
        const {t} = this.props.i18n;

        return  <div className="form-control">
        {
            (label)
            ?   <label className="label">
              <span className="label-text">{label}</span>
            </label> 
            : null
        }

        <div className='flex justify-start items-center'>
            {
                (pb_enable)
                ? <Field name={name}>
                    {({
                    field : { value, onChange, onBlur },
                    form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                    }) => {
                        let show_error = meta.touched && meta.error;
                        const select_date = fromUnixTime(value);

                        let menu = <TimeSelect value={value} onChange={setFieldValue.bind({},name)} toggleDropdown={this.props.toggleDropdown}/>
                        return <div>
                            <div>
                                <Dropdown
                                    overlay={menu} visible={dropdown_visible}
                                >
                                    <div onClick={this.props.toggleDropdown} className="flex justify-start cursor-pointer">
                                    {
                                        (select_date)
                                        ? <span className="text-sm flex items-center px-4 py-2 border-2 border-black">
                                            <div className="">
                                                {format(select_date,'yyyy-MM-dd HH:mm')}
                                                <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
                                            </div>
                                        </span>
                                        : <span className="text-sm text-gray-400">{t('please select date')}</span>
                                    }
                                    <span className='bg-black text-white p-2 px-4'><CalendarIcon className='icon-sm'/></span>
                                    </div>
                                </Dropdown>
                            </div>
                            {
                                (show_error)
                                ? <div className="input-error-msg">{meta.error}</div>
                                : null
                            }
                        </div>
                    }}
                </Field>
                : <div className='text-gray-400'>{t('public sale will not have an end time')}</div>
            }
            
            <div className='ml-4'>
                <FormSwitch name={"pb_end_time_enable"} className="toggle toggle-primary"/>
            </div>
        </div>

        </div>


    }
}


export default PublicEndTimeSelect


