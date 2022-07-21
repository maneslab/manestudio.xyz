import React from 'react';
import {Steps,Step} from 'components/common/step/index'
import {withTranslate} from 'hocs/index'
import Link from 'next/link'

@withTranslate
class ClubStep extends React.Component {

    getGeneratorUrl(club_id,active) {

        let base = '/project/'+club_id;
        switch(Number(active)) {
            case 1:
                return base+'/group';
            case 2:
                return base+ '/generate';
            case 3:
                return base+ '/metadata';
            case 4:
                return base+ '/reserve';
            default:
                return ''
        }
    }

    getNormalUrl(club_id,active) {

        let base = '/project/'+club_id;
        switch(Number(active)) {
            case 1:
                return base+'/group';
            case 2:
                return base+ '/metadata';
            case 3:
                return base+ '/reserve';
            default:
                return ''
        }
    }

    getStepIdByName(project_type,name) {
        if (project_type == 'use_generator') {
            switch(name) {
                case 'setting':
                    return 1;
                case 'generate':
                    return 2;
                case 'metadata':
                    return 3;
                case 'reserve':
                    return 4;
                default:
                    return 0;
            }
        }else {
            switch(name) {
                case 'setting':
                    return 1;
                case 'metadata':
                    return 2;
                case 'reserve':
                    return 3;
                default:
                    return 0;
            }
        }
    }


    render() {

        const { active_name,club_id,project_type} = this.props;
        const {t} = this.props.i18n;

        let active = this.getStepIdByName(project_type,active_name);
        console.log('active_name',active_name,active,this.props);

        return <div className='bg-white dark:bg-[#22252b] pt-0 pb-6 -mt-8 mb-8 '>
            <div className="max-w-screen-xl mx-auto flex justify-between ">
                <Steps active={active}>
                    <Step href={this.getGeneratorUrl(club_id,1)} key={1}>{t('setting')}</Step>
                    <Step href={this.getGeneratorUrl(club_id,2)} key={2}>{t('deploy contract')}</Step>
                </Steps>
                <div>
                    {
                        (this.props.next_step == false)
                        ?  <button className='btn btn-primary' disabled>{t('next')}</button>
                        : <>
                        {
                            ((active < 4 && project_type == 'use_generator') || (active < 3 && project_type == 'normal'))
                            ?   <Link href={(project_type=='use_generator')?this.getGeneratorUrl(club_id,active+1):this.getNormalUrl(club_id,active+1)}>
                                <button className='btn btn-primary'>{t('next')}</button>
                            </Link>
                            : null
                        }
                        </>
                    }
                   
                </div>
            </div>
        </div>
    }
}

module.exports = ClubStep
