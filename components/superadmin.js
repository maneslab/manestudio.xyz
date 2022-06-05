import React from 'react';
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'

class SuperAdminWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {

        const {login_user} = this.props;

        let allow = false;
        if (login_user && login_user.get('is_super_admin')) {
            allow = true;
        }

        // if (!allow) {
        //     return <div className="py-24 text-center">
        //         <div className="flex justify-center mb-4"><ShieldExclamationIcon className="w-12 h-12 text-red-500" /></div>
        //         <div className="text-black text-xl font-ubuntu font-bold capitalize">Permission error</div>
        //     </div>
        // }

        return (
            <div>
                {this.props.children}
            </div>
        );
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
export default connect(mapStateToProps,mapDispatchToProps)(SuperAdminWrapper);

