import React, { useState,useEffect } from "react";
import {getTheme,setTheme} from 'helper/local'

import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function DarkmodeSwitch({loading,className,...props}) {

    let [themeInCache,setThemeInCache] = useState('default')

    let setDarkMode = (v) => {
        if (v) {
            setTheme('dark');
            setThemeInCache('dark');
        }else {
            setTheme('default');
            setThemeInCache('default');
        }
    }

    useEffect(() => {
        let theme = getTheme();
        setDarkMode((theme=='dark'));
    },[]);


    return <DarkModeSwitch
        moonColor={'#fff'}
        sunColor={'#333'}
        checked={themeInCache=='dark'}
        onChange={()=>{
            setDarkMode(!(themeInCache == 'dark'))
        }}
        size={18}
    />


}
