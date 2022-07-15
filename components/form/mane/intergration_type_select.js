import React from 'react';
// import autobind from 'autobind-decorator'

import withDropdown from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import Dropdown from 'rc-dropdown';

@withTranslate
@withDropdown
class IntergrationSelect extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {

        const {label,name,data_map,dropdown_visible,toggleDropdown,value} = this.props;
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
        let menu = <div className="block-menu jd-border">
            <ul className="overflow-y-scroll">
                {
                    Object.keys(map_data).map((key)=>{
                        let v = map_data[key];
                        return <li key={key} >
                            <a className="select-li" 
                                onClick={()=>{
                                this.props.onChange(key);
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

        return  <div className="form-control">
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
            <div>
                <div>
                    <Dropdown
                        overlay={menu} visible={dropdown_visible}
                        >
                        <div onClick={toggleDropdown} className="select-box select-arrow">
                            <div className='default-holder'>
                        {
                            (value)
                            ? <span>
                                {map_data[value]}
                            </span>
                            : <span>{t('please select')}</span>
                        }
                        </div></div>
                    </Dropdown>
                </div>
            </div>
        </div>
    }
}




module.exports = IntergrationSelect
