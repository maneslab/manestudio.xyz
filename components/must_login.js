import React from 'react';
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import {setGlobalModal} from 'redux/reducer/setting'

class MustLoginWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {

        const {login_user} = this.props;

        if (login_user) {
            return <div>
                {this.props.children}
            </div>
        }else {
            return <div className="h-full flex flex-col items-center justify-center h-96 text-center">
                <button onClick={this.props.setGlobalModal.bind({},'connect')} className="btn btn-primary btn-lg">Connect Wallet</button>
            </div>
        }
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setGlobalModal : (data) => {
            return dispatch(setGlobalModal(data))
        }
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
export default connect(mapStateToProps,mapDispatchToProps)(MustLoginWrapper);

