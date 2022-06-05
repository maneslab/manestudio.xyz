import React from 'react';

import Dropdown from 'rc-dropdown';
import Button from 'components/common/button'

import classNames from 'classnames';
import {withTranslate} from 'hocs/index'
import {setCache} from 'helper/local'

import setLanguage from 'next-translate/setLanguage'

@withTranslate
class LanguageBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible : false
        }
        this.setLanguage = this.setLanguage.bind(this)
        this.toggleVisible = this.toggleVisible.bind(this)
    }   

    toggleVisible(visi) {
        this.setState({
            'visible' : !this.state.visible
        })
    }

    setLanguage(language) {
        
        language = language.toLowerCase();

        setLanguage(language);  ///设置当前语言
        this.toggleVisible();   //关闭弹窗
        setCache('language',language);         ///记录到localstorage
    }

    transferCountryToLanguage(country) {
        switch(country) {
            case 'US':
                return 'EN';
            case 'CN':
                return 'ZH';
            case 'JP':
                return 'JA';
            case 'KR':
                return 'KO';
            default:
                return country;
        }
    }

    transferLanguageToCountry(lang) {
        lang = lang.toUpperCase();
        switch(lang) {
            case 'EN':
                return 'US';
            case 'ZH':
                return 'CN';
            case 'JA':
                return 'JP';
            case 'KO':
                return 'KR';
            default:
                return lang;
        }
    }

    transferLanguageToFullName(lang) {
        lang = lang.toUpperCase();
        let full = null;
        switch(lang) {
            case 'EN':
                full = 'English';
                break;
            case 'JA':
                full = '日本语';
                break;
            case 'ZH':
                full = '中文';
                break;
            case 'ID':
                full = 'Indonesian';
                break;
            case 'KO':
                full = '한국어';
                break;
            case 'DE':
                full = 'Deutsche';
                break;
            case 'FR':
                full = 'Français';
                break;
                  

            default:
        }
        return full;
    }

    getFlagIcon(country) {
        return <img 
            src={"/img/flag/country-4x3/"+country.toLowerCase()+".svg"}
            className="h-4 rounded"
        />
    }

    render() {
        const {t,lang} = this.props.i18n;
        const {visible} = this.state;

        const default_langs = ['EN','ZH'];
        const country = this.transferLanguageToCountry(lang);

        // console.log('debug-lang',lang,country);

        let content = <div className="block-menu shadow-xl w-48">
            <ul className='overflow-y-auto w-full bg-white py-2'>
                {
                    default_langs.map(one=>{
                        let country = this.transferLanguageToCountry(one).toLowerCase();
                        return <li key={one}>
                            <a onClick={this.setLanguage.bind({},one)} className="select-li">
                            <span className="icon">
                                {this.getFlagIcon(country)}
                            </span>
                            <span className='word'>
                            {
                                this.transferLanguageToFullName(one)
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
            <Dropdown visible={visible} overlay={content} 
                trigger="click"
                placement="bottomLeft" onVisibleChange={this.toggleVisible} >
                <Button className={classNames('btn-with-arrow jd-select-arrow mr-4',{"press-down":visible})}>
                    <div className="flex items-center text-sm">
                    <span className="md:mr-2">{this.getFlagIcon(country)}</span>
                    <span className='hidden md:block'>{this.transferLanguageToFullName(lang)}</span>
                    </div>
                </Button>
            </Dropdown>
            {
                (visible)
                ? <div className='mask-bg' onClick={this.toggleVisible}></div>
                : null
            }
            </div>
        );
    }
}

module.exports = LanguageBtn
