import React from 'react';
import { Field } from 'formik';
// import autobind from 'autobind-decorator'

import classNames from 'classnames';
// import {getSocialMediaIcon} from 'helper/link';
import withDropdown from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
// import Dropdown from 'rc-dropdown';
// import { map } from 'react-immutable-proptypes';

@withTranslate
@withDropdown
class BgSelect extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {

        const {label,name,data_map,dropdown_visible,toggleDropdown} = this.props;
        const {t} = this.props.i18n;

        // console.log('data_map',typeof data_map,data_map,Array.isArray(data_map))

        let map_data = {};
        if (Array.isArray(data_map)) {
            Object.values(data_map).map(one=>{
                map_data[one] = one;
            })
        }else {
            map_data = data_map;
        }

        return  <div className="form-control">
            
            <Field name={name}>
            {({
               field : { name, value, onChange, onBlur },
               form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                {/* console.log('debugbgmeta',meta,value) */}
                return (
                    <div className='border-t border-gray-300 py-4 border-b mb-5 flex justify-between items-center'>
                        <label className="label">
                            <span className="label-text">{label}</span>
                        </label>
                        <div className="flex justify-start space-x-2">
                            {
                                Object.keys(map_data).map((key)=>{
                                    let v = map_data[key];
                                    return <a className={classNames("bg-select-a",{"active":(value == v)})} key={key}
                                        onClick={()=>{
                                        setFieldValue(name,key);
                                        // this.props.setPlatform(key);
                                        // toggleDropdown();
                                    }}>
                                    <span className={classNames("bg",v)}>
                                    </span>
                                    </a>
                                })
                            }
                        </div>
                        {meta.touched && meta.error && (
                           <div className="input-error-msg">{meta.error}</div>
                        )}
                    </div>
                )}
            }
           </Field> 
        </div>
    }
}




module.exports = BgSelect
