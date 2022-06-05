import { normalize } from 'normalizr';
import Immutable from 'immutable';

import { safeboxListSchema ,safeboxSchema } from 'redux/schema/index'
import Safebox  from 'helper/web3/zksafebox';
import Erc20 from 'helper/web3/erc20'

function formatSafeboxOne(one) {
    return {
        'boxhash' : one.boxhash,
        'owner' : one.owner,
    }
}

// function formatSafeboxList(arr) {
//     let result = new Array();
//     console.log('debug05,formatSafeboxList',arr)
//     arr.map(one=>{
//         result.push(formatSafeboxOne(one))
//     })
//     return result
// }


export const BEFORE_LOAD_SAFEBOX = 'BEFORE_LOAD_SAFEBOX'
export const LOAD_SAFEBOX_SUCCESS = 'LOAD_SAFEBOX_SUCCESS'
export const LOAD_SAFEBOX_FAILURE = 'LOAD_SAFEBOX_FAILURE'

export function loadSafebox(wallet_address) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_SAFEBOX', 'LOAD_SAFEBOX_SUCCESS', 'LOAD_SAFEBOX_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['safebox','load',wallet_address,'is_fetching']),
        // 进行取：
        callAPI: () => {
            let fm = new Safebox();
            console.log('loadsafebox->fm.contract',wallet_address)

            return fm.contract.owner2safebox(wallet_address);
        },

        dataSource : 'contract',

        data_format : (result) => {
            console.log('loadsafebox->result',result)
            let result_formated = formatSafeboxOne(result);
            return normalize(result_formated, safeboxSchema)
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },

        payload: {
            wallet_address:wallet_address,
        }
    };
}


export const BEFORE_LOAD_SAFEBOX_BALANCE = 'BEFORE_LOAD_SAFEBOX_BALANCE'
export const LOAD_SAFEBOX_BALANCE_SUCCESS = 'LOAD_SAFEBOX_BALANCE_SUCCESS'
export const LOAD_SAFEBOX_BALANCE_FAILURE = 'LOAD_SAFEBOX_BALANCE_FAILURE'

export function loadSafeboxBalance(wallet_address,tokens = []) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_SAFEBOX_BALANCE', 'LOAD_SAFEBOX_BALANCE_SUCCESS', 'LOAD_SAFEBOX_BALANCE_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['safebox','load',wallet_address,'is_fetching']),
        // 进行取：
        callAPI: async () => {
            let fm = new Safebox();
            console.log('loadsafebox_balance->request',wallet_address,tokens)

            let balance_result = await fm.contract.balanceOf(wallet_address,tokens);
            console.log('loadsafebox_balance->balance_result',balance_result)

            let balance_map = {};
            await Promise.all(
                tokens.map(async(one,i) => {
                    
                    let erc20 = new Erc20(one);
                    let decimals = await erc20.getDecimals();
                    let symbol = await erc20.contract.symbol();

                    balance_map[one] = {
                        'value' : balance_result[i],
                        'decimals' : decimals,
                        'symbol'   : symbol
                    }
                })
            )
            
            console.log('loadsafebox_balance->balance_map',balance_map)

            return balance_map
        },

        dataSource : 'contract',

        data_format : (result) => {
            console.log('loadsafebox_balance->data_format',result)
            // let result_formated = formatSafeboxOne(result);
            // return normalize(result_formated, safeboxSchema)
            return result
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },

        payload: {
            wallet_address:wallet_address,
        }
    };
}


export function reducer(state = Immutable.fromJS({
    'load' : {},
    'load_balance' : {}
}), action) {
    switch (action.type) {

        case BEFORE_LOAD_SAFEBOX_BALANCE:
            return state
            .setIn(['load_balance',action.payload.wallet_address,'is_fetching'],true)
            .setIn(['load_balance',action.payload.wallet_address,'is_fetched'],false)
            .setIn(['load_balance',action.payload.wallet_address,'result'],'')

        case LOAD_SAFEBOX_BALANCE_SUCCESS:
            return state
            .setIn(['load_balance',action.payload.wallet_address,'is_fetching'],false)
            .setIn(['load_balance',action.payload.wallet_address,'is_fetched'],true)
            .setIn(['load_balance',action.payload.wallet_address,'result'],Immutable.fromJS(action.payload.response))
        
        case LOAD_SAFEBOX_BALANCE_FAILURE:
            return state
            .setIn(['load_balance',action.payload.wallet_address,'is_fetching'],false)
            .setIn(['load_balance',action.payload.wallet_address,'is_fetched'],true)

        case BEFORE_LOAD_SAFEBOX:
            return state
            .setIn(['load',action.payload.wallet_address,'is_fetching'],true)
            .setIn(['load',action.payload.wallet_address,'is_fetched'],false)
            .setIn(['load',action.payload.wallet_address,'result'],'')

        case LOAD_SAFEBOX_SUCCESS:
            return state
            .setIn(['load',action.payload.wallet_address,'is_fetching'],false)
            .setIn(['load',action.payload.wallet_address,'is_fetched'],true)
            .setIn(['load',action.payload.wallet_address,'result'],action.payload.response.result)

        case LOAD_SAFEBOX_FAILURE:
            return state
            .setIn(['load',action.payload.wallet_address,'is_fetching'],false)
            .setIn(['load',action.payload.wallet_address,'is_fetched'],true)


        default:
            return state
    }
}


