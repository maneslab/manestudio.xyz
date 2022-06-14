
import { Field } from 'formik';
import classNames from 'classnames'
import Input from 'components/form/input'

const PrefixInput = ({ name, label, placeholder,notice,prefix,at_end,className, ...props }) => {
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
                return <div>
                <div className={classNames("input-with-prefix",className,{"has-error":show_error})}>
                {
                    (!at_end)
                    ? <div className='prefix'>{prefix}</div>
                    : null
                }
                <Input placeholder={placeholder} value={value} className="input-inner" onChange={(e)=>setFieldValue(name,e.target.value)} onBlur={(e)=>setFieldTouched(name,true)} {...props}/>
                {
                    (at_end)
                    ? <div className='prefix'>{prefix}</div>
                    : null
                }
                </div>
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

export default PrefixInput; 