import React from 'react';
import {Steps,Step} from 'components/common/step/index'
import {withTranslate} from 'hocs/index'
import Link from 'next/link'


@withTranslate
class ClubLockStep extends React.Component {

    getUrl(club_id,active) {

        let base = '/project/'+club_id;
        switch(Number(active)) {
            case 1:
                return base+'/group';
            case 2:
                return base+ '/metadata';
            default:
                return ''
        }
    }

    getStepIdByName(project_type,name) {
        switch(name) {
            case 'setting':
                return 1;
            case 'metadata':
                return 2;
            default:
                return 0;
        }
    }


    render() {

        const { active_name,club_id,project_type} = this.props;
        const {t} = this.props.i18n;

        let active = this.getStepIdByName(project_type,active_name);

        return <div className='bg-white dark:bg-[#22252b] pt-0 pb-6 -mt-8 mb-8 '>
            <div className="max-w-screen-xl mx-auto flex justify-between h-10">
                <Steps active={active}>
                    <Step href={this.getUrl(club_id,1)} key={1}>{t('setting')}</Step>
                    <Step href={this.getUrl(club_id,2)} key={2}>metadata</Step>
                </Steps>
                
                <div>
                    {
                        (this.props.next_step == false)
                        ?  <button className='btn btn-primary' disabled>{t('next')}</button>
                        : <>
                        {
                            (active < 2)
                            ?   <Link href={this.getUrl(club_id,active+1)}>
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

module.exports = ClubLockStep
