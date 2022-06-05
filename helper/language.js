import {getConfig} from 'helper/config'
import detectBrowserLanguage from 'detect-browser-language'
import {getCache} from 'helper/local'

function flip(obj) {
    let new_obj = {}
    for (let k in obj) {
        let value = obj[k]; //将原来的value赋值给一个变量
        new_obj[value] = k; // 为cluster_info赋新key，不能直接使用cluster_info = {cluster_info[k] : k},会报语法错误
    }
    return new_obj
}

let langMap = {
    'us' : 'en',
    'cn' : 'zh',
    'jp' : 'ja',
    'kr' : 'ko',
    'vn' : 'vi'
};
 
let countryMap = flip(langMap);

export const transferLanguageToCountry = (lang) => {
    // console.log('transferLanguageToCountry,输入',lang)
    if (countryMap.hasOwnProperty(lang)) {
        // console.log('transferLanguageToCountry,输出',this.countryMap[lang])
        return countryMap[lang];
    }
    return lang;
}


export const transferCountryToLanguage = (country) => {
    if (langMap.hasOwnProperty(country)) {
        return langMap[country];
    }
    return country;
}

export const transferLanguageToFullName = (lang) => {
    let full = null;
    switch(lang) {
        case 'en':
            full = 'English';
            break;
        case 'ja':
            full = '日本語';
            break;
        case 'zh':
            full = '中文';
            break;
        case 'id':
            full = 'Indonesian';
            break;
        case 'fr':
            full = 'Français';
            break;
        case 'it':
            full = 'Italiano';
            break;
        case 'ru':
            full = 'русский';
            break;
        case 'de':
            full = 'Deutsch';
            break;
        case 'ko':
            full = '한국어';
            break;
        case 'vi':
            full = 'Tiếng Việt';
            break;
        default:
    }
    return full;
}

export const getFlag = (country) => {
    // console.log('传入的国家是',country);
    let flag = null;

    if (!country) {
        return flag;
    }

    let country_lower = country.toLowerCase();
    flag = <img src={'/img/flag/country-4x3/'+country_lower+'.svg'} className="flag"/>
    // console.log('得到的flag是',flag);
    return flag;
}

//探测本地的语言，如果有localstorage存储的语言以localstorage为准，否则以浏览器为准
export const detectLocalLanguage = () => {
    let lang_in_local = getCache('language');
    // console.log('localstorage存储的语言是',lang_in_local);
    if (!lang_in_local) {
        let lang = detectBrowserLanguage();
        lang_in_local = lang.slice(0,2);
        // console.log('探测到的浏览器语言是',lang_in_local);
    }
    return lang_in_local
}