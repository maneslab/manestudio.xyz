import React from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import { Field } from 'formik';

import Dropdown from 'rc-dropdown';

import {ChevronDownIcon} from '@heroicons/react/outline'

class ExpiretimeSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'dropdown_visible' : false,
        }
    }   

    @autobind
    toggleVisible() {
        this.setState({ dropdown_visible : !this.state.dropdown_visible });
    }

    getName(day) {
        if (day == 1) {
            return '1 day';
        }else {
            return day + " days";
        }
    }

    render() {
        const {dropdown_visible} = this.state;
        const {label,name} = this.props;

        let days = [1,3,7,30];

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
                return <div>
                <Dropdown overlay={<div className="bg-white shadow-lg rounded-lg overflow-hidden border bg-yellow-100 border-yellow-300">
                    <ul className="overflow-y-scroll">
                        {
                            days.map(one=>{
                                return <li key={one} className="select-one" onClick={()=>{
                                    setFieldValue(name,one);
                                    this.toggleVisible();
                                }}>{this.getName(one)}</li>
                            })
                        }
                    </ul>
                </div>} visible={dropdown_visible}>
                    <div onClick={()=>{
                        this.setState({'dropdown_visible':!dropdown_visible});
                    }} className={classNames("input-box yellow flex justify-between items-center h-10 cursor-pointer",{"placeholder":!value},{"input-error":show_error})} >
                        {
                            (!value)
                            ? "please select the expire time"
                            : this.getName(value)
                        }
                        <ChevronDownIcon className="w-4"/>
                    </div>
                </Dropdown>
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


