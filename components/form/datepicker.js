
import { Field } from 'formik';
import Picker from 'rc-picker';

// import Input from 'components/form/input'
import 'rc-picker/assets/index.css';

const DatePickerComponent = ({ name, label, placeholder,notice, ...props }) => {
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
                <Picker
                    onChange={(e)=>setFieldValue(name,e.target.value)}
                    onBlur={(e)=>setFieldTouched(name,true)}
                    value={value}
                    className='my-custom-datepicker-component'
                    {...props}
                    />
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

export default DatePickerComponent; 