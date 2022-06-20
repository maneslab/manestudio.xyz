import React from 'react';
import {Steps,Step} from 'components/common/step/index'
import {withTranslate,withMustLogin} from 'hocs/index'

@withTranslate
class ClubStep extends React.Component {

    render() {

        const { active } = this.props;
        const {t} = this.props.i18n;
        return <div className='bg-white  py-8 -mt-8 mb-8 border-t border-gray-200'>
            <div className="max-w-screen-xl mx-auto flex justify-start ">
                <Steps active={active}>
                    <Step>{t('setting')}</Step>
                    <Step>{t('generate')}</Step>
                    <Step>{t('metadata')}</Step>
                </Steps>
            </div>
        </div>
    }
}

module.exports = ClubStep
