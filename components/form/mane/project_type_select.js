import React from 'react';
import { Field } from 'formik';

import classNames from 'classnames';
import {withTranslate} from 'hocs/index'
import EmptyCircleIcon from 'public/img/icons/empty_circle.svg';
import CheckCircleIcon from 'public/img/icons/check_circle.svg';

@withTranslate
class ProjectTypeSelect extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {
        const {t} = this.props.i18n;
        const {label,name} = this.props;

        // let map_data = {
        //     'use_generator' : 'use_generator',
        //     'normal'        : 'normal'
        // };

        return  <div className="form-control">
            <Field name={name}>
            {({
               field : { name, value, onChange, onBlur },
               form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                return (
                    <div className=''>
                        <label className="label">
                            <span className="label-text">{label}</span>
                        </label>
                        <div className="project-type-select">
                            
                            <div className={classNames("select-one",{"active":(value == 'use_generator')})} onClick={()=>{
                                setFieldValue(name,'use_generator');
                            }}>
                                <h3>
                                    <span>{t('Create Generative Collection')}</span>
                                    {
                                        (value == 'use_generator')
                                        ?  <CheckCircleIcon className='icon'/>
                                        :  <EmptyCircleIcon className='icon'/>
                                    }
                                </h3>
                                <div className='p-4 text-sm'>
                                    <div className='mb-2'>
                                        {t('Project-type-1')}
                                    </div>
                                    <div>
                                        {t('Project-type-2')}
                                    </div>
                                </div>
                            </div>
                            <div className={classNames("select-one",{"active":(value == 'normal')})} onClick={()=>{
                                setFieldValue(name,'normal');
                            }}>
                                <h3>
                                    <span>{t('Batch Upload Artworks')}</span>
                                    {
                                        (value == 'normal')
                                        ?  <CheckCircleIcon className='icon'/>
                                        :  <EmptyCircleIcon className='icon'/>
                                    }
                                   
                                </h3>
                                <div className='p-4 text-sm'>
                                    <div className='mb-2'>
                                        {t('Project-type-3')}
                                    </div>
                                    <div>
                                        {t('Project-type-4')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {meta.touched && meta.error && (
                           <div className="input-error-msg">{meta.error}</div>
                        )}
                    </div>
                )}
            }
           </Field> 
        </div>
    }
}


module.exports = ProjectTypeSelect
