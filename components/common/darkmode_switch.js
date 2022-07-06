import React, { useState } from "react";
import {getTheme,setTheme} from 'helper/local'

import Switch from "rc-switch";
import { SunIcon,MoonIcon } from "@heroicons/react/outline";

export default function DarkmodeSwitch({loading,className,...props}) {

    let default_theme = getTheme();
    let [themeInCache,setThemeInCache] = useState(default_theme)
    let setDarkMode = (v) => {
        if (v) {
            setTheme('dark');
            setThemeInCache('dark');
        }else {
            setTheme('default');
            setThemeInCache('default');
        }
    }
    // <Switch
    // onChange={setDarkMode}
    // disabled={false}
    // checked={themeInCache =='dark'}
    // />
    return (
        <a className="cursor-pointer" onClick={()=>{
            setDarkMode(!(themeInCache == 'dark'))
        }}>
        {
            (themeInCache == 'dark') 
            ? <MoonIcon className="icon-sm"/>
            : <SunIcon className="icon-sm"/>
        }
        </a>

    )
}
