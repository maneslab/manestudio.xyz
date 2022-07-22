
import { Field,ErrorMessage } from 'formik';
import classnames from 'classnames'
import Input from 'components/form/input'

const CommonField = ({ name, label, placeholder,notice, className , onlyEnglish, onlyLayer, ...props }) => {

    return <div className={classnames("form-control",className)} >
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
                <Input placeholder={placeholder} has_error={show_error} value={value} onChange={(e)=>{
                    let value = e.target.value;
                    if (onlyEnglish) {
                        value = value.replace(/[^A-Za-z0-9-_]/ig, '')
                    }else if (onlyLayer) {
                        value = value.replace(/[^0-9a-z ]/ig, '')
                        value = value.toLowerCase();
                    }
                    setFieldValue(name,value)
                }} onBlur={(e)=>setFieldTouched(name,true)} {...props}/>
                <div className='text-red-500'>
                <ErrorMessage name={name} />
                </div>
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