import React from 'react';
import { Field } from 'formik';
import autobind from 'autobind-decorator'

// import classNames from 'classnames';
// import {getSocialMediaIcon} from 'helper/link';
import withDropdown from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import Dropdown from 'rc-dropdown';
import { map } from 'react-immutable-proptypes';

@withTranslate
@withDropdown
class CommonSelect extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {

        const {label,name,data_map,dropdown_visible,toggleDropdown} = this.props;
        const {t} = this.props.i18n;

        console.log('data_map',typeof data_map,data_map,Array.isArray(data_map))

        let map_data = {};
        if (Array.isArray(data_map)) {
            Object.values(data_map).map(one=>{
                map_data[one] = one;
            })
        }else {
            map_data = data_map;
        }

        // let theme_map = {
        //     'theme-00'  :  'default',
        //     'theme-01'  :  'yellow',
        //     'theme-02'  :  'geek',
        //     'theme-03'  :  'pink',
        //     'theme-04'  :  'black&white',
        //     'theme-05'  :  'matrix',
        //     'theme-06'  :  'black',
        // }

        return  <div className="form-control">
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
            <Field name={name}>
            {({
               field : { name, value, onChange, onBlur },
               form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                console.log('debugmeta',value)
                let menu = <div className="block-menu jd-border">
                    <ul className="overflow-y-scroll">
                        {
                            Object.keys(map_data).map((key)=>{
                                let v = map_data[key];
                                return <li key={key} >
                                    <a className="select-li" 
                                        onClick={()=>{
                                        setFieldValue(name,key);
                                        // this.props.setPlatform(key);
                                        toggleDropdown();
                                    }}>
                                    <span className='name'>
                                    {
                                        v
                                    }
                                    </span>
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                </div>
                return (
                    <div>
                        <div>
                            <Dropdown
                                overlay={menu} visible={dropdown_visible}
                               >
                                <div onClick={toggleDropdown} className="jd-select jd-select-arrow">
                                {
                                    (value)
                                    ? <div className="select-li">
                                        <span className='name'>
                                        {map_data[value]}
                                        </span>
                                    </div>
                                    : <span className="select-li">{t('please select')}</span>
                                }
                                </div>
                            </Dropdown>
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




module.exports = CommonSelect
