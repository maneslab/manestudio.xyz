import React from 'react';


// import withWallet from 'hocs/wallet';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import withLoginUser from 'hocs/login_user';
import WalletLogin from 'components/wallet/login'

@withLoginUser
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
        }

        return <div className='flex justify-center items-center py-24'>
            <WalletLogin handleLogin={this.props.loginUser}/>
        </div>
        
    }
}

export default MustLoginWrapper;

