import React, { useState } from "react";
import {getTheme,setTheme} from 'helper/local'

import Switch from "rc-switch";
import { SunIcon,MoonIcon } from "@heroicons/react/outline";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

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
    return <DarkModeSwitch
        checked={(themeInCache == 'dark')}
        onChange={()=>{
            setDarkMode(!(themeInCache == 'dark'))
        }}
        size={18}
    />

    // <Switch
    // onChange={setDarkMode}
    // disabled={false}
    // checked={themeInCache =='dark'}
    // />
}
