import {getConfig} from 'helper/config'

export const setThemeInCss = (theme) => {
    if (theme == 'dark') {
        document.documentElement.classList.add('dark')
    }else {
        document.documentElement.classList.remove('dark')
    }
}

export const setTheme = (value) => {
    setCache('theme',value);
    setThemeInCss(value);
}

export const getTheme = () => {
    if (!checkLocalStorageValue('theme') && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }else {
        let theme = getCache('theme');
        if (!theme) {
            return 'default';
        }else {
            return theme;
        }
    }
}


const checkLocalStorageValue = (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        if (key in window.localStorage) {
            return true;
        }else {
            return false;
        }
    }else {
        console.log('localStorage不存在')
        return false;
    }
}


const checkLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return true;
    }else {
        console.log('localStorage不存在')
        return false;
    }
}

export const setCache  =  (name,value) => {
    if (checkLocalStorage()) {
        window.localStorage.setItem(name,value)
        return true;
    }else {
        return false;
    }
}


export const getCache  =  (name,default_value = null) => {
    if (checkLocalStorage()) {
        if (window.localStorage.getItem(name) === null) {
            return default_value;
        }else {
            return window.localStorage.getItem(name)
        }
    }
}
export const clearCache = (name) => {
    if (checkLocalStorage()) {
        window.localStorage.removeItem('name')
        return true;
    }else {
        return false;
    }
}
