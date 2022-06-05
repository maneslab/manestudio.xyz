import React, { Component } from 'react'
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'

export default function withLoginUser(WrappedComponent) {

    class LoginUserClass extends Component {
        constructor(props) {
            super(props)
        }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    const mapDispatchToProps = (dispatch) => {
        return {
        }
    }
    function mapStateToProps(state,ownProps) {

        let entities = state.get('entities');
        ///注册成功
        let login_user_id = state.getIn(['setting','login_user']);
        let login_user = null;
        if (login_user_id) {
            login_user = denormalize(login_user_id,userSchema,entities)
        }

        return {
            'login_user'  :  login_user,
        }
    }
    return connect(mapStateToProps,mapDispatchToProps)(LoginUserClass);

}

