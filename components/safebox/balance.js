import React from 'react';

import {connect} from 'react-redux';
import Immutable from 'immutable';
import autobind from 'autobind-decorator';
import {getConfig} from 'helper/config'
import Loading from 'components/common/loading'

import {withTranslate} from 'hocs/index'
import zksafebox from 'helper/web3/zksafebox';
import {loadSafeboxBalance} from 'redux/reducer/safebox'
import WithdrawModal from 'components/safebox/withdraw_modal'

import withWallet from 'hocs/wallet';
import {autoDecimal} from 'helper/number'
import {getAmountFromValueAndDecimals} from 'helper/web3/number'

@withTranslate
@withWallet
class SafeboxBalance extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'show_withdraw_modal' : false,
            'withdraw_token'      : null,
            'withdraw_token_address' : null
        }
        this.formRef = React.createRef();
        this.zksafebox  = null;

    }

    componentDidMount() {
        this.zksafebox = new zksafebox();
        let token_list = getConfig('TOKEN_LIST');
        this.props.loadSafeboxBalance(this.props.wallet.address,token_list);
    }


    @autobind
    showWithdrawModal(token,addr) {
        this.setState({
            show_withdraw_modal : true,
            withdraw_token      : token,
            withdraw_token_address : addr
        });
    }

    @autobind
    hideWithdrawModal(token) {
        this.setState({
            show_withdraw_modal : false,
            withdraw_token      : null,
            withdraw_token_address : null
        });
    }

    @autobind
    refresh() {
        let token_list = getConfig('TOKEN_LIST');
        this.props.loadSafeboxBalance(this.props.wallet.address,token_list);
    }

    render() {
        const {t} = this.props.i18n;
        const {wallet,safebox_data_all} = this.props;

        let safebox_one = null;
        if (wallet.address) {
            safebox_one = safebox_data_all.getIn([wallet.address]);
        }

        if (!safebox_one) {
            return null;
        }

        let balance_map = Immutable.Map({});
        if (safebox_one.get('result')) {
            balance_map = safebox_one.get('result');
        }
        console.log('balance_map',balance_map,safebox_one.toJS());

        let result_td_list = [];
        if (balance_map) {
            balance_map.map((one,addr)=>{
                result_td_list.push(<tr key={addr}>
                    <td>{one.get('symbol')}</td>
                    <td>
                        {autoDecimal(getAmountFromValueAndDecimals(one.get('value').toString(),one.get('decimals').toString()))}
                    </td>
                    <td className='flex justify-end'>
                    <button className='btn btn-primary btn-sm' onClick={this.showWithdrawModal.bind({},one,addr)}>{t('withdraw')}</button>
                    </td>
                </tr>)
            })
        }

        return <div>
            <h2 className='h2 mb-4'>{t('safebox balance')}</h2>
            <table className='data-table'>
                <thead>
                    <tr>
                        <th>{t('token')}</th>
                        <th>{t('balance')}</th>
                        <th className='flex justify-end'>{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
            {
                (safebox_one.get('is_fetching'))
                ? <tr>
                    <td colSpan={4} className="p-4"><Loading /></td>
                </tr>
                : <>
                {
                    result_td_list
                }
                </>
            }
            </tbody>
            </table>

            <WithdrawModal 
                wallet={wallet}
                token_address={this.state.withdraw_token_address}
                token={this.state.withdraw_token} 
                after_success={this.refresh}
                closeModal={this.hideWithdrawModal} 
                visible={this.state.show_withdraw_modal}/>
        </div>
                  
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSafeboxBalance : (address,token_list) => {
            console.log('loadSafeboxBalance',address,token_list)
            return dispatch(loadSafeboxBalance(address,token_list))
        },
    }
}
function mapStateToProps(state,ownProps) {

    return {
        safebox_data_all : state.getIn(['safebox','load_balance']),
        entities         : state.get('entities')
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(SafeboxBalance);



