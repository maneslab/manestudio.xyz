import React from 'react';
import {Steps,Step} from 'components/common/step/index'
import {withTranslate,withMustLogin} from 'hocs/index'

@withTranslate
class ClubAddStep extends React.Component {

    render() {
        const { active } = this.props;
        const {t} = this.props.i18n;
        return <div className='bg-gray-100 p-8'>
            <Steps active={active}>
                <Step>{t('set club profile')}</Step>
                <Step>{t('link discord group')}</Step>
                <Step>{t('publish my membership NFT')}</Step>
                <Step>{t('share link and earn money')}</Step>
            </Steps>
        </div>
    }
}

module.exports = ClubAddStep
