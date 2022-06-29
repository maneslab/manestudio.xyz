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

    render() {

        const { active,club_id } = this.props;
        const {t} = this.props.i18n;


        return <div className='bg-white  pt-0 pb-6 -mt-8 mb-8 '>
            <div className="max-w-screen-xl mx-auto flex justify-between ">
                <Steps active={active}>
                    <Step href={this.getUrl(club_id,1)} key={1}>{t('setting')}</Step>
                    <Step href={this.getUrl(club_id,2)} key={2}>{t('generate NFT')}</Step>
                    <Step href={this.getUrl(club_id,3)} key={3}>metadata</Step>
                    <Step key={4}>reserve</Step>
                </Steps>
                <div>
                    {
                        (active < 4)
                        ?   <Link href={this.getUrl(club_id,active+1)}>
                            <button className='btn btn-primary'>{t('next')}</button>
                        </Link>
                        : null
                    }
                </div>
            </div>
        </div>
    }
}

module.exports = ClubStep
