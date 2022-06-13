import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { removeValueEmpty} from 'helper/common'
import { roadmapListSchema } from 'redux/schema/index'

export const BEFORE_LOAD_ROADMAP_LIST = 'BEFORE_LOAD_ROADMAP_LIST'
export const LOAD_ROADMAP_LIST_SUCCESS = 'LOAD_ROADMAP_LIST_SUCCESS'
export const LOAD_ROADMAP_LIST_FAILURE = 'LOAD_ROADMAP_LIST_FAILURE'

export function loadRoadmapList(condition) {
    condition = removeValueEmpty(condition);
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_ROADMAP_LIST', 'LOAD_ROADMAP_LIST_SUCCESS', 'LOAD_ROADMAP_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['roadmap','list',condition.club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/roadmap/list',
                'data'    : condition
            })
        },

        data_format : (result) => {

            var output = normalize(result.data, roadmapListSchema)
            return output
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },

        payload: {
            club_id : condition.club_id,
        }
    };
}


//添加
export const BEFORE_SAVE_ROADMAP  = 'BEFORE_SAVE_ROADMAP'
export const SAVE_ROADMAP_SUCCESS = 'SAVE_ROADMAP_SUCCESS'
export const SAVE_ROADMAP_FAILURE = 'SAVE_ROADMAP_FAILURE'

export function saveRoadmapList(data) {
    // var hash = getHashByData(data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_SAVE_ROADMAP', 'SAVE_ROADMAP_SUCCESS', 'SAVE_ROADMAP_FAILURE'],
        // 检查缓存 (可选):
        // shouldCallAPI:  (state) => !state.getIn(['roadmap','updating',data.club_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/roadmap/save',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (result) => {
            console.log('result',result)
            return normalize(result.data, roadmapListSchema)
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
    'list' : {},
    'updating' : {},
}), action) {

    switch (action.type) {

        case BEFORE_SAVE_ROADMAP:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],true)

        case SAVE_ROADMAP_SUCCESS:
        case SAVE_ROADMAP_FAILURE:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],false)

       case BEFORE_LOAD_ROADMAP_LIST:
            if (!state.getIn(['list',action.payload.club_id,'list'])) {
                state = state.setIn(['list',action.payload.club_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.club_id,'is_fetching'],true)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case LOAD_ROADMAP_LIST_SUCCESS:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],true)
            .setIn(['list',action.payload.club_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_ROADMAP_LIST_FAILURE:
            return state.setIn([action.payload.club_id,'is_fetching'],false)


        default:
            return state
    }
}


