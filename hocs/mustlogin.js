import React, { Component } from 'react'
import PageWrapper from 'components/pagewrapper'
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import WalletLogin from 'components/wallet/login'
import withWallet from 'hocs/wallet'

import { logoutUser } from 'redux/reducer/user';

export default function withMustLogin(WrappedComponent) {

    class Logincheck extends Component {

        constructor(props) {
            super(props)
            this.state = {}
        }

        componentDidUpdate(prevProps) {
            if (!this.props.wallet && prevProps.wallet) {
                // console.log('debug10,钱包退出登陆');
                this.props.logoutUser();
            }
            if (this.props.wallet && !prevProps.wallet){
                // console.log('debug10,钱包登陆');
            }
        }
        
        render() {

            const {wallet,login_user} = this.props;

            const {t} = this.props.i18n;

            if (login_user && wallet && wallet.address && login_user.get('wallet_address').toLowerCase() == wallet.address.toLowerCase()) {
                return <WrappedComponent {...this.props} />;
            }else {
                return <PageWrapper>
                    <div className='my-12'>
                        <div className='font-bold text-xl text-center mb-4 capitalize'>{t('connect web3 wallet')}</div>
                        <div className='flex justify-center my-8'>
                            <WalletLogin />
                        </div>
                    </div>
                </PageWrapper>
            }
        }

    }



    const mapDispatchToProps = (dispatch) => {
        return {
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
        }
    }
    return withWallet(connect(mapStateToProps,mapDispatchToProps)(Logincheck));

}

