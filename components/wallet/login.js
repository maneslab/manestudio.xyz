import React from 'react';
// import { ConnectButton } from '@rainbow-me/rainbowkit'

import ConnectButton from 'components/wallet/connect_button'

import WalletPersonalSign from 'components/wallet/personal_sign'
import withWallet from 'hocs/wallet';
import { connect } from 'react-redux'
import {getUnixtime} from 'helper/time'
import {loginUser} from 'redux/reducer/user'
import autobind from 'autobind-decorator';

@withWallet
class WalletLogin extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            'is_init' : false,
        }
    }
    
    componentDidMount() {
        this.setState({
            'is_init' : true
        })
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

        const {wallet} = this.props;
        const {is_init} = this.state;

        if (!is_init) {
            return false;
        }

        if (wallet && wallet.address) {

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
        }
    }
}
function mapStateToProps(state,ownProps) {
    return {}
}
export default connect(mapStateToProps,mapDispatchToProps)(WalletLogin);
