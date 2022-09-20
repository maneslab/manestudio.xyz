import React from 'react';
import { Field } from 'formik';

import withDropdown from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import Dropdown from 'rc-dropdown';
import withLabel from 'hocs/label'

import { httpRequest } from 'helper/http';
import {ErrorMessage} from 'formik'
import {removeValueEmpty} from 'helper/common'

@withTranslate
@withLabel
@withDropdown
class BluechipSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            "bluechip_list" : {},
            "kw"            : ''
        }
        this.getBluechipList = ::this.getBluechipList
    }   

    componentDidMount() {
        this.getBluechipList();
    }


    async getBluechipList(){

        this.setState({
            'is_fetching' : true
        })

        let result = await httpRequest({
            'url' : '/v1/bluechip_list',
            'method' : 'GET',
            'data'  : {}
        })
        console.log('debug01,result',result);

        this.setState({
            'is_fetching' : false,
            'is_fetched'  : true,
            'bluechip_list'    : result.data
        })

    }

    ifValueIncludeInList(value,list){
        return list.indexOf(value) > -1;
    }

    removeEmptyValueInArray(new_array) {
        return new_array.filter(one=>one!='');
    }

    render() {

        const {name,dropdown_visible,toggleDropdown,setNotice,side_notice} = this.props;
        const {bluechip_list,kw} = this.state;
        const {t} = this.props.i18n;
        
        return <Field name={name}>
            {({
            field : { name, value },
            form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
            }) => {

                let vs = value.split(",");
                {/* console.log('debugvs,bluechip_list',bluechip_list); */}

                let select_names = [];
                vs.map(one=>{
                    if (one) {
                        select_names.push(bluechip_list[one]);
                    }
                })

                {/* console.log('debugvs,',vs,select_names) */}

                let menu = <div className="block-menu border-2 border-black">
                    <div className='p-2'>
                        <input placeholder={t('search NFT project')} className='input-box' value={kw} onChange={(e)=>{
                            this.setState({
                                kw : e.target.value
                             })
                        }}/>
                    </div>
                    <ul className="overflow-y-scroll max-h-96">
                        {
                            Object.keys(bluechip_list).map((key)=>{
                                let v = bluechip_list[key];
                                let checked = false;
                                if (this.ifValueIncludeInList(key,vs)) {
                                    checked = true;
                                }
                                if (kw) {
                                    if (v.toLowerCase().indexOf(kw) == -1) {
                                        return null;
                                    }
                                }
                                return <li key={key} >
                                    <a className="flex justify-between items-center p-2 text-sm capitalize font-ubuntu hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                                        onClick={()=>{

                                            if (checked) {
                                                vs = vs.filter(one=>one!=key);
                                            } else {
                                                vs.push(key);
                                            }
                                            vs = this.removeEmptyValueInArray(vs);
                                            if (vs.length > 0) {
                                                setFieldValue(name,vs.join(","));
                                            }else {
                                                setFieldValue(name,"");
                                            }
                                        // this.props.setPlatform(key);
                                        // toggleDropdown();
                                    }}>
                                    <span className='name'>
                                    {
                                        v
                                    }
                                    </span>
                                    <span className='flex items-center'>
                                        <input type="checkbox" className='checkbox-input' checked={checked}/>
                                    </span>
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
                                <div onClick={toggleDropdown} className="input-box input-select-box cursor-pointer"
                                onMouseEnter={(e)=>{
                                    if (typeof setNotice === 'function' && side_notice) {
                                        setNotice(side_notice)
                                    } 
                                }}
                                onMouseLeave={(e)=> {
                                    if (typeof setNotice === 'function') {
                                        setNotice(null)
                                    } 
                                }} 
                                >
                                {
                                    (select_names.length > 0)
                                    ? <div className="text-clip text-ellipsis">
                                        {select_names.join(" / ")}        
                                    </div>
                                    : <span className="">{t('select bluechip')}</span>
                                }
                                </div>
                            </Dropdown>
                            {
                                (dropdown_visible)
                                ? <div className='mask-bg' onClick={toggleDropdown}></div>
                                : null
                            }
                        </div>
                        <ErrorMessage name={name} />
                    </div>
                )}
            }
        </Field> 



    }
}


module.exports = BluechipSelect
