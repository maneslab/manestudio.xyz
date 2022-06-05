
import { Field } from 'formik';

import Input from 'components/form/input'
import EthIcon from 'public/img/token/eth.svg'

const CommonField = ({ name, label, placeholder,notice,setPricePreview, ...props }) => {
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
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex justify-start items-center px-4 mr-4 w-24 input-box yellow ">
                        <EthIcon className="h-4 mr-2 "/>ETH
                    </div>
                    <div className='col-span-2'>
                        <Input 
                            color="yellow"
                            placeholder={'price'} 
                            has_error={show_error} 
                            value={value} 
                            onChange={(e)=>{
                            setFieldValue(name,e.target.value)
                            if (setPricePreview) {
                                setPricePreview(e.target.value)
                            }
                        }} onBlur={(e)=>setFieldTouched(name,true)} {...props}/>
                    </div>
                </div>
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