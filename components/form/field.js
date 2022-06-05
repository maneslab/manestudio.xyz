
import { Field } from 'formik';

import Input from 'components/form/input'

const CommonField = ({ name, label, placeholder,notice, ...props }) => {
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
                {/* console.log('show_error',show_error,meta) */}
                return <div  className="form-input-wapper">
                <Input placeholder={placeholder} has_error={show_error} value={value} onChange={(e)=>setFieldValue(name,e.target.value)} onBlur={(e)=>setFieldTouched(name,true)} {...props}/>
                {
                    (show_error)
                    ? <div className="input-error-msg">{meta.error}</div>
                    : null
                }
                {
                    (notice)
                    ? <div className="text-base text-gray-600 pt-1">{notice}</div>
                    : null
                }
                </div>
            }}
        </Field>
    </div>
}; 

export default CommonField; 