import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';
// import autobind from 'autobind-decorator'
// import classNames from 'classnames';

// import {getConfig} from 'helper/config'
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'

@withDropdown
@withTranslate
class DuringTimeSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    render() {
        const {label,name,dropdown_visible} = this.props;
        const {t} = this.props.i18n;

        let default_times = {
            '86400'         :   t('1 day'),
            '604800'        :   t('7 days'),
            '2592000'       :   t('30 days'),
            '31536000'      :   t('365 days')
        }

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
                const select_contract = value;
                const select_contract_name = (default_times[value]) ? default_times[value] : '';
                
                console.log('debug-select',select_contract_name,select_contract);

                let menu = <div className="block-menu shadow-xl">
                    <ul className="overflow-y-auto w-full bg-white py-2 border-gray-200 border">
                        {
                            Object.keys(default_times).map(addr=>{
                                return <li key={addr} >
                                    <a className="select-li" 
                                        onClick={()=>{
                                            setFieldValue(name,addr);
                                            this.props.toggleDropdown();
                                        }}>
                                    <div className="">
                                        {default_times[addr].toUpperCase()}    
                                    </div>
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
                                <div onClick={this.props.toggleDropdown} className="jd-select jd-select-arrow">
                                <div className='select-li'>
                                {
                                    (select_contract)
                                    ? <span className="text-sm flex items-center">
                                        <div className="">
                                            {select_contract_name}    
                                        </div>
                                    </span>
                                    : <span className="text-sm text-gray-400">{t('please select during time')}</span>
                                }
                                </div>
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




module.exports = DuringTimeSelect
