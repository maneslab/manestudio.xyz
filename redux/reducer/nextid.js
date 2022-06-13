import { normalize } from 'normalizr';
import Immutable from 'immutable';

import { personListSchema } from 'redux/schema/index'
import {getConfig} from 'helper/config'
import fetch from 'unfetch'

import { ProofClient, ProofService } from "@nextdotid/sdk";


export const BEFORE_LOAD_PROOF_LIST = 'BEFORE_LOAD_PROOF_LIST'
export const LOAD_PROOF_LIST_SUCCESS = 'LOAD_PROOF_LIST_SUCCESS'
export const LOAD_PROOF_LIST_FAILURE = 'LOAD_PROOF_LIST_FAILURE'

export function loadProofList(address) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_PROOF_LIST', 'LOAD_PROOF_LIST_SUCCESS', 'LOAD_PROOF_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['nextid','proof_list',address,'is_fetching']),
        // 进行取：
        callAPI: async () => {

            let env = getConfig('NEXTID_ENV');

            const proofService = new ProofService({
                platform: "ethereum",
                identity: address,
                client: (env == 'production') ? ProofClient.production(fetch) : ProofClient.development(fetch),
            });
    
            return proofService.allExistedBinding();
        },

        dataSource : 'contract',

        data_format : (result) => {
            console.log('debug06,result',result)
            return normalize(result,personListSchema);
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },

        payload: {
            address : address
        }
    };
}



export function reducer(state = Immutable.fromJS({
    'proof_list' : {},
}), action) {
    switch (action.type) {

        case BEFORE_LOAD_PROOF_LIST:
            return state
            .setIn(['proof_list',action.payload.address,'is_fetching'],true)
            .setIn(['proof_list',action.payload.address,'is_fetched'],false)
            .setIn(['proof_list',action.payload.address,'result'],Immutable.List([]))


        case LOAD_PROOF_LIST_SUCCESS:
            return state
            .setIn(['proof_list',action.payload.address,'is_fetching'],false)
            .setIn(['proof_list',action.payload.address,'is_fetched'],true)
            .setIn(['proof_list',action.payload.address,'result'],Immutable.List(action.payload.response.result))

        case LOAD_PROOF_LIST_FAILURE:
            return state
            .setIn(['proof_list',action.payload.address,'is_fetching'],false)
            .setIn(['proof_list',action.payload.address,'is_fetched'],true)


        default:
            return state
    }
}


