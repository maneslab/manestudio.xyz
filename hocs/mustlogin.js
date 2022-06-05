import React, { Component } from 'react'
import PageWrapper from 'components/pagewrapper'
import { connect } from 'react-redux'

import { denormalize } from 'normalizr';
import { userSchema } from 'redux/schema/index'
import {setGlobalModal} from 'redux/reducer/setting'

export default function withMustLogin(WrappedComponent) {

    class Logincheck extends Component {

        constructor(props) {
            super(props)
            this.state = {}
        }
        
        render() {
        const {t} = this.props.i18n;

            if (this.props.login_user) {
                return <WrappedComponent {...this.props} />;
            }else {
                return <PageWrapper>
                    <div className='my-12'>
                        <div className='font-bold text-3xl text-center'>{t('login required to access')}</div>
                        <div className='flex justify-center my-8'>
                            <button className='btn btn-primary btn-lg' onClick={this.props.setGlobalModal.bind({},'connect')}>{t('connect wallet')}</button>
                        </div>
                    </div>
                </PageWrapper>
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
    return connect(mapStateToProps,mapDispatchToProps)(Logincheck);

}

