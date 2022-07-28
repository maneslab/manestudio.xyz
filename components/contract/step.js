import React from 'react';
import {Steps,Step} from 'components/common/step/index'
import {withTranslate} from 'hocs/index'
import Link from 'next/link'

@withTranslate
class ClubStep extends React.Component {

    getUrl(club_id,active) {

        let base = '/project/'+club_id;
        switch(Number(active)) {
            case 1:
                return base+'/contract';
            case 2:
                return base+ '/choose_network';
            default:
                return ''
        }
    }

    getStepIdByName(name) {
        switch(name) {
            case 'setting':
                return 1;
            case 'deploy':
                return 2;
            default:
                return 0;
        }
    }


    render() {

        const { active_name,club_id,next_step} = this.props;
        const {t} = this.props.i18n;

        let active = this.getStepIdByName(active_name);
        // console.log('active_name',active_name,active,this.props);

        return <div className='bg-white dark:bg-[#22252b] pt-0 pb-6 -mt-8 mb-8 '>
            <div className="max-w-screen-xl mx-auto flex justify-between h-10">
                <Steps active={active}>
                    <Step href={this.getUrl(club_id,1)} key={1}>{t('settings')}</Step>
                    <Step href={this.getUrl(club_id,2)} key={2}>{t('deploy contract')}</Step>
                </Steps>
                <div>
   
                    {
                        (active < 2)
                        ?  <>
                        {
                            (next_step == false)
                            ? <button className='btn btn-primary' disabled>{t('next')}</button>
                            : <Link href={this.getUrl(club_id,active + 1)}>
                                <button className='btn btn-primary'>{t('next')}</button>
                            </Link>
                        }
                        </>
                        : null
                    }
                   
                </div>
            </div>
        </div>
    }
}

module.exports = ClubStep
