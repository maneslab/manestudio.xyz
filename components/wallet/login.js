import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator';

import ConnectButton from 'components/wallet/connect_button'
import WalletPersonalSign from 'components/wallet/personal_sign'

import withWallet from 'hocs/wallet';
import {getUnixtime} from 'helper/time'
import {loginUser,logoutUser} from 'redux/reducer/user'
import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'

@withWallet
class WalletLogin extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'show_type' : null
        }
    }
    
    static getDerivedStateFromProps(props, state) {


        const {login_user,wallet} = props;

        let CONNECT = 'connect';
        let SIGN_MESSAGE = 'sign_message'

        let show_type = 'connect';

        // console.log('debug03->this.props.wallet',wallet);
        if (login_user) {
            console.log('debug03->this.props.login_user',login_user.toJS());
        }else {
            console.log('debug03->this.props.login_user is not exist');
        }
        /*
            分成5种情况
            1. 都登陆，且相同
            2. 都登陆，且不同同
            3. wallet尚未connect
            4. login_user为空
            5. 都为空
        */

        //都为空的情况
        if (!login_user && !wallet.address) {
            show_type = CONNECT;
        }

        //wallet存在，但是login_user为空的情况
        if (!login_user && wallet.address) {
            show_type = SIGN_MESSAGE;
        }

        //login_user存在，但是wallet为空的情况
        if (login_user && !wallet.address) {

            ///登出登陆用户
            // this.logoutUser();
            show_type = CONNECT;
        }


        //都存在的情况，并且相同
        if (login_user && wallet.address && login_user.get('wallet_address').toLowerCase() == wallet.address.toLowerCase()) {
            show_type = CONNECT;
        }

        //都存在的情况，并且不相同
        if (login_user && wallet.address && login_user.get('wallet_address').toLowerCase() != wallet.address.toLowerCase()) {

            ///登出登陆用户
            // this.logoutUser();
            show_type = SIGN_MESSAGE;
        }

        return {
            show_type: show_type,
        }
    }

    componentDidUpdate(prevProps,prevState) {
        // console.log('debug03->componentDidUpdate',this.props.is_inited);

        if (this.props.is_inited) {
            
            const {login_user,wallet} = this.props;

            if (login_user && !wallet) {
                console.log('debug03->因为发现登陆用户却没有发现connect-wallet，调用登出')
                this.logoutUser();
            }


            if (login_user && wallet && this.getJwtAddress(login_user) != this.getWalletAddress(wallet)) {
                console.log('debug03->因为发现登陆用户和connect-wallet不一致，调用登出')
                this.logoutUser();
            }

        }
    }

    componentDidMount() {
        // console.log('debug03->componentDidMount',this.props.is_inited);
        if (this.props.is_inited) {
            
            const {login_user,wallet} = this.props;

            if (login_user && !wallet) {
                console.log('debug03->因为发现登陆用户却没有发现connect-wallet，调用登出')
                this.logoutUser();
            }


            if (login_user && wallet && this.getJwtAddress(login_user) != this.getWalletAddress(wallet)) {
                console.log('debug03->因为发现登陆用户和connect-wallet不一致，调用登出')
                this.logoutUser();
            }

        }
    }

    getJwtAddress(login_user) {
        let addr = (login_user && login_user.get('wallet_address')) ? login_user.get('wallet_address').toLowerCase() : '';
        return addr;
    }

    getWalletAddress(wallet) {
        let addr =(wallet && wallet.address) ? wallet.address.toLowerCase() : '';
        return addr;
    }

    logoutUser() {
        this.props.logoutUser();
    }

    generatePayload(wallet_address) {
        return {
            'action_name' : 'login',
            'site'        : 'manestudio',
            'create_time' : getUnixtime(),
            'wallet_address' : wallet_address
        }
    }

    @autobind
    login(message,sign) {
        const {wallet} = this.props;

        this.props.loginUser({
            'address' : wallet.address,
            'sign'    : sign,
            'message' : message
        })
    }

    render() {

        const {wallet,is_inited} = this.props;
        const {show_type} = this.state;

        // console.log('debug03->render,is_inited',is_inited)

        if (!is_inited) {
            return null;
        }

        if (show_type == 'sign_message') {

            let payload = this.generatePayload(wallet.address);
            let msgstr = JSON.stringify(payload);  

            return <WalletPersonalSign handleLogin={this.login.bind({},msgstr)}  message_str={msgstr}/>
        }else {
            return <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon"/>
        }

    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        loginUser : (data) => {
            return dispatch(loginUser(data))
        },
        logoutUser : () => {
            return dispatch(logoutUser())
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
        'is_inited'   :  state.getIn(['setting','is_inited'])
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(WalletLogin);
