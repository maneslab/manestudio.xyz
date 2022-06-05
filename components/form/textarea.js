
import { Field } from 'formik';
import classNames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize';

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
                return <div  className="form-input-wapper">
                <TextareaAutosize placeholder={placeholder} 
                    minRows={props.minRows?props.minRows:3}
                    value={value} 
                    className={classNames("w-full input-box focus:outline-none",{"has-error":show_error})}
                    onChange={(e)=>setFieldValue(name,e.target.value)} 
                    onBlur={(e)=>setFieldTouched(name,true)} 
                    {...props}/>
                {
                    (show_error)
                    ? <div className="input-error-msg">{meta.error}</div>
                    : null
                }
                {
                    (notice)
                    ? <div className="text-sm text-gray-400 pt-1">{notice}</div>
                    : null
                }
                </div>
            }}
        </Field>
    </div>
}; 

export default CommonField; 