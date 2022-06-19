import React, { Component } from 'react'
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { clubSchema } from 'redux/schema/index'

export default function withActiveClub(WrappedComponent) {

    class WithActiveClubComponent extends Component {

        constructor(props) {
            super(props)
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }

    }



    const mapDispatchToProps = (dispatch) => {
        return {
        }
    }
    function mapStateToProps(state,ownProps) {
   
        let entities = state.get('entities');
        let active_club_id = state.getIn(['setting','active_club_id'])
       
        ///注册成功
        let active_club = null;
        if (active_club_id) {
            active_club = denormalize(active_club_id,clubSchema,entities)
        }
   
   
        return {
           'active_club'    : active_club,
           'active_club_id' : active_club_id,
        }
    }
   
   return connect(mapStateToProps,mapDispatchToProps)(WithActiveClubComponent)

}

