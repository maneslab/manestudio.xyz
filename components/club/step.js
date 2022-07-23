import React from 'react';
import ClubStepGenerator from 'components/club/step/generator'
import ClubStepLock from 'components/club/step/lock'
import ClubStepNormal from 'components/club/step/normal'

class ClubStep extends React.Component {


    render() {
        const { active_name,club_id,is_lock} = this.props;

        let {project_type} = this.props;
        if (!project_type) {
            project_type = 'use_generator';
        }

        if(is_lock) {
            return <ClubStepLock club_id={club_id} active_name={active_name} />
        }
        if (project_type == 'use_generator') {
            return <ClubStepGenerator club_id={club_id} active_name={active_name} />
        }else {
            return <ClubStepNormal club_id={club_id} active_name={active_name} />
        }
    }
}

module.exports = ClubStep
