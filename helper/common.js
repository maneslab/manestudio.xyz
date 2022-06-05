import md5 from 'blueimp-md5'
import Immutable from "immutable";
import {getConfig} from 'helper/config'

export function getUrl(url) {
    let base_url = getConfig('WEBSITE');
    return base_url+url
}

export function getApiUrl(url) {
    let base_url = getConfig('API');
    return base_url+url
}

export function isSuperAdmin(login_user) {
    if (!login_user) {
        return false;
    }
    if (!login_user.get('is_super_admin')) {
        return false;
    }
}

export function sortArray(arr,is_desc = false) {
    if (is_desc) {
        return arr.sort(function(a, b){return b - a});
    }else {
        return arr.sort(function(a, b){return a - b});
    }
}

export function getShortAddress(address) {
    let short_address = address.slice(0,4) + '...' + address.slice(-4);
    return short_address
}

export function getShortAddress2(address) {
    let short_address = address.slice(-6);
    return short_address
}

export function getHashByData(data) {
    // console.log('要签名的数据是',data);
    var myObj = data,
      keys = [],
      k, i, len;

    for (k in myObj) {
      if (myObj.hasOwnProperty(k)) {
        keys.push(k);
      }
    }

    keys.sort();
    len = keys.length;

    var str = '';
    for (i = 0; i < len; i++) {
      k = keys[i];
      if (k != 'page' && k != 'offset' && k != 'before_time_usec' && k != 'page_size') {
        str += k + ':' + myObj[k];
      }
    }
    // console.log('签名字符串是',str);
    // console.log('签名后是',md5(str));
    return md5(str);
}


export function removeValueEmpty(obj) {
    var new_obj = {}
    for (var name in obj) {
        if (obj[name] !=='' && obj[name] !== undefined) {
            new_obj[name] = obj[name]
        }
    }
    return new_obj;
}


export const createAction = (action_name) => {
    return (data) => {
        return {
            'type'      : action_name,
            'payload'   : data
        }
    }
}
/*
*   这个方法针对scope的key做了不做encodeURIComponent的特殊处理
*/
export function discordUrlStringify(obj,url) {
    var params = []
    Object.keys(obj).forEach(function(key){
        var value = obj[key];
        if (typeof value === 'undefined') {
            value = ''
        }
        // 对于需要编码的文本（比如说中文）我们要进行编码
        if (key != 'scope') {
            params.push([key, encodeURIComponent(value)].join('='))
        }else {
            params.push([key, value].join('='))
        }
    });

    if (url) {
        if (params.length > 0) {
            return url + '?' + params.join('&');
        }else {
            return url
        }
    }else{
        return params.join('&')
    }
} 


/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function urlStringify(obj,url = null) {
    var params = []
    Object.keys(obj).forEach(function(key){
        var value = obj[key];
        if (typeof value === 'undefined') {
            value = ''
        }
        // 对于需要编码的文本（比如说中文）我们要进行编码
        params.push([key, encodeURIComponent(value)].join('='))
    });

    if (url) {
        if (params.length > 0) {
            return url + '?' + params.join('&');
        }else {
            return url
        }
    }else{
        return params.join('&')
    }

    
}

export function getOS() {

    if (typeof window === 'undefined') {
        return 'Other'
    }

    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

export function getOsMainKey() {
    let os = getOS();
    let main_key = '';
    switch(os) {
        case 'Mac OS':
            main_key = '⌘'
            break;
        case 'Windows':
            main_key = 'win'
            break
        case 'Linux':
            main_key = 'win'
            break
        default:
            main_key = null;
            break;
    }
    return main_key;
}

export const defaultListData = Immutable.fromJS({
    'list'  : [],
    'total' : 0,
    'is_fetching' : false,
    'is_fetched'  : false
})

export const defaultLoadData = Immutable.fromJS({
    'is_fetching' : false,
    'is_fetched'  : false
})

export const isMatchUrl =  function(asPath,href,matchstart = false) {
    let is_match;

    if (matchstart === true) {
        is_match = (asPath.indexOf(href) == 0);
    }else {
        is_match = (asPath === href);
    }
    return is_match;
}


export const isMatchUrlArray =  function(asPath,href_arr,matchstart = false) {
    let is_match = false;
    href_arr.map(href=>{
        if (matchstart === true && !is_match) {
            is_match = (asPath.indexOf(href) == 0);
        }else if (!is_match) {
            is_match = (asPath === href);
        }
    })
    
    return is_match;
}

export const isUnloginAllowedPage = function (route) {
    return (route == '/user/login' 
            || route == '/user/register'
            || route == '/user/reset_password'
            || route == '/user/forget')
}