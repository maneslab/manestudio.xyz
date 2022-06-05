import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';
import autobind from 'autobind-decorator'

import classNames from 'classnames';

import {getConfig} from 'helper/config'
import {transferLanguageToCountry,transferCountryToLanguage,getFlag,transferLanguageToFullName} from 'helper/language'
import {withTranslate} from 'hocs/index'

@withTranslate
class LanguageBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'dropdown_visible' : false,
        }
        this.default_langs = getConfig('LANGUAGES');
    }   

    @autobind
    toggleVisible() {
        this.setState({ dropdown_visible : !this.state.dropdown_visible });
    }

    render() {
        const {label,name} = this.props;
        const {dropdown_visible,selected_language} = this.state;
        const {t} = this.props.i18n;

        console.log('this.default_langs',this.default_langs);

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
                // console.log('debug-form',form,meta);
                const selected_language = value;
                const selected_country = transferLanguageToCountry(value);

                let menu = <div className="block-menu shadow-xl">
                    <ul className="overflow-y-auto w-full bg-white py-2">
                        {
                            this.default_langs.map(lang=>{
                                let country = transferLanguageToCountry(lang);
                                return <li key={lang} >
                                    <a className="sider-a" 
                                        onClick={()=>{
                                        setFieldValue(name,lang);
                                        this.toggleVisible();
                                    }}>
                                    <div className="">
                                        {getFlag(country)}    
                                    </div>
                                    {
                                        transferLanguageToFullName(lang)
                                    }
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
                                <div onClick={this.toggleVisible} className="jd-select-2 jd-select-arrow">
                                {
                                    (selected_language)
                                    ? <span className="text-sm flex items-center">
                                        <div className="">
                                            {getFlag(selected_country)}    
                                        </div>
                                        {transferLanguageToFullName(selected_language)}
                                    </span>
                                    : <span className="text-sm text-gray-400">{t('please select language')}</span>
                                }
                                </div>
                            </Dropdown>
                        </div>
                        {meta.touched && meta.error && (
                           <div className="input-error-msg">{meta.error}</div>
                        )}
                        <p className="text-sm text-gray-500">{t("language_warning_intro")}</p>
                    </div>
                )}
            }
           </Field> 
        </div>
    }
}




module.exports = LanguageBtn
