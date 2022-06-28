
import { Field ,ErrorMessage} from 'formik';
import classNames from 'classnames'
import {percentDecimal} from 'helper/number'

import React,{useState} from 'react';

const PercentInput = ({ name, label, placeholder,className, ...props }) => {

    return <div className="form-control">
        {
            (label)
            ?   <label className="label">
              <span className="label-text">{label}</span>
            </label> 
            : null
        }
        <Field name={name}>
            {({
               field : { value },
               form: { setFieldValue , setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                let show_error = meta.touched && meta.error;
                let show_value = percentDecimal(value);
                return <div>
                    <div className={classNames("input-with-prefix",className,{"has-error":show_error})}>
                        <PercentInputComponent 
                            placeholder={placeholder} 
                            value={show_value} 
                            setValue={(v)=>{
                                return setFieldValue(name,v)
                            }} 
                            onBlur={(e)=>setFieldTouched(name,true)} 
                            {...props}/>
                        <div className='prefix end'>%</div>
                    </div>
                    <ErrorMessage name={name} />
                </div>
            }}
        </Field>
    </div>
}; 


class PercentInputComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value : props.value,
        }
        this.onChange = ::this.onChange
    }   

    onChange(e) {
        this.setState({
            value   :   e.target.value
        })
        this.props.setValue((e.target.value/100).toFixed(4));
    }

    render() {
        const {placeholder} = this.props;
        return  <input value={this.state.value} className="input-inner" onChange={this.onChange} onBlur={this.props.onBlur}/>
    }
}

export default PercentInput; 