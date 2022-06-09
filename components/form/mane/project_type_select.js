import React from 'react';
import { Field } from 'formik';

import classNames from 'classnames';
import {withTranslate} from 'hocs/index'
import {t} from 'helper/translate'

@withTranslate
class ProjectTypeSelect extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {

        const {label,name} = this.props;

        let map_data = {
            'use_generator' : 'use_generator',
            'normal'        : 'normal'
        };


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
                        <div className={classNames("select-one",{"active":(value == 'normal')})} onClick={()=>{
                                setFieldValue(name,'normal');
                            }}>
                                <h3>{t('Batch Upload Artworks')}</h3>
                                <div className='p-4 text-sm'>
                                    <div className='mb-2'>
                                        {t('Batch upload already finished artworks, add properties manually')}
                                    </div>
                                    <div>
                                        {t('Recommened for artists who want to create a collection of small amount, like 1-100')}
                                    </div>
                                </div>
                            </div>
                            <div className={classNames("select-one",{"active":(value == 'use_generator')})} onClick={()=>{
                                setFieldValue(name,'use_generator');
                            }}>
                                <h3>{t('Create Generative Collection')}</h3>
                                <div className='p-4 text-sm'>
                                    <div className='mb-2'>
                                        {t('The smart tool by ManeSTUDIO allows artists to create their own collections by simply uploading traits in different layers. ')}
                                    </div>
                                    <div>
                                        {t('You can easily tweak the rarity of each trait with the built-in editor.')}
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
