
import { Field } from 'formik';
import classnames from 'classnames'
import Input from 'components/form/input'
import ErrorMessage from 'components/form/error_message'

const CommonField = ({ name, label, placeholder,notice, className , onlyEnglish, onlyLayer, setNotice,side_notice, ...props }) => {

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
                        value = value.replace(/[^A-Za-z0-9-_ ]/ig, '')
                    }else if (onlyLayer) {
                        value = value.replace(/[^0-9a-z ]/ig, '')
                        value = value.replace( /\s+/g, ' ')
                        value = value.toUpperCase();
                    }
                    setFieldValue(name,value)
                }} 
                onMouseEnter={(e)=>{
                    console.log('debug:检查到onFouc事件',typeof setNotice,side_notice)
                    if (typeof setNotice === 'function' && side_notice) {
                        setNotice(side_notice)
                    } 
                }}
                onMouseLeave={(e)=> {
                    if (typeof setNotice === 'function') {
                        setNotice(null)
                    } 
                }} 
                onBlur={(e)=>{
                    setFieldTouched(name,true)
                }}
                {...props}/>
                <ErrorMessage name={name} />
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