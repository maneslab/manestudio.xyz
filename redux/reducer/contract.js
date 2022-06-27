import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { removeValueEmpty} from 'helper/common'
import { contractSchema } from 'redux/schema/index'

export const BEFORE_LOAD_CONTRACT = 'BEFORE_LOAD_CONTRACT'
export const LOAD_CONTRACT_SUCCESS = 'LOAD_CONTRACT_SUCCESS'
export const LOAD_CONTRACT_FAILURE = 'LOAD_CONTRACT_FAILURE'

export function loadContract(club_id) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_CONTRACT', 'LOAD_CONTRACT_SUCCESS', 'LOAD_CONTRACT_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['contract','load',club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/contract/load',
                'data'    : {
                    club_id 
                }
            })
        },

        data_format : (result) => {

            var output = normalize(result.data, contractSchema)
            return output
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },

        payload: {
            club_id : club_id
        }
    };
}


//添加
export const BEFORE_SAVE_CONTRACT  = 'BEFORE_SAVE_CONTRACT'
export const SAVE_CONTRACT_SUCCESS = 'SAVE_CONTRACT_SUCCESS'
export const SAVE_CONTRACT_FAILURE = 'SAVE_CONTRACT_FAILURE'

export function saveContract(data) {
    // var hash = getHashByData(data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_SAVE_CONTRACT', 'SAVE_CONTRACT_SUCCESS', 'SAVE_CONTRACT_FAILURE'],
        // 检查缓存 (可选):
        // shouldCallAPI:  (state) => !state.getIn(['contract','updating',data.club_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/contract/save',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (result) => {
            console.log('result',result)
            return normalize(result.data, contractSchema)
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            club_id : data.club_id
        }
    };
}




export function reducer(state = Immutable.fromJS({
    'load' : {},
    'updating' : {},
}), action) {

    switch (action.type) {

        case BEFORE_SAVE_CONTRACT:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],true)

        case SAVE_CONTRACT_SUCCESS:
        case SAVE_CONTRACT_FAILURE:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],false)

       case BEFORE_LOAD_CONTRACT:
            if (!state.getIn(['load',action.payload.club_id,'contract_id'])) {
                state = state.setIn(['load',action.payload.club_id,'contract_id'],null);
            }
            return state
            .setIn(['load',action.payload.club_id,'is_fetching'],true)
            .setIn(['load',action.payload.club_id,'is_fetched'],false)

        case LOAD_CONTRACT_SUCCESS:
            return state.setIn(['load',action.payload.club_id,'is_fetching'],false)
            .setIn(['load',action.payload.club_id,'is_fetched'],true)
            .setIn(['load',action.payload.club_id,'contract_id'],action.payload.response.result)

        case LOAD_CONTRACT_FAILURE:
            return state.setIn(['load',action.payload.club_id,'is_fetching'],false)

        default:
            return state
    }
}


