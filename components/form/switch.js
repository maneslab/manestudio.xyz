import React from 'react'
import { Field } from 'formik';
import autobind from 'autobind-decorator'
import Switch from 'rc-switch';

// import {httpRequest} from 'helper/http'

class FormSwitch extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {label,name} = this.props;

        return <Field name={name}>
            {({
               field : {value}, // { name, value, onChange, onBlur }
               form: { setFieldValue , setFieldTouched }, 
               meta,
            }) => {

                let onChange = (v)=>{
                    if (v) {
                        setFieldValue(name,1);
                        if (this.props.afterChange) {
                            this.props.afterChange(name,1);
                        }
                    }else {
                        setFieldValue(name,0);
                        if (this.props.afterChange) {
                            this.props.afterChange(name,0);
                        }
                    }
                }
                return (
                    <>
                        <Switch
                          onChange={onChange}
                          disabled={false}
                          checked={value}
                          // checkedChildren="开"
                          // unCheckedChildren="关"
                        />
                        {meta.touched && meta.error && (
                           <div className="error">{meta.error}</div>
                        )}
                    </>
                )}
            }
           </Field> 
    }
    
}



export default FormSwitch; 