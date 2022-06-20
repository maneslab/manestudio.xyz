import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { getHashByData,removeValueEmpty} from 'helper/common'

import { imageTraitListSchema , imageTraitSchema } from 'redux/schema/index'


export const BEFORE_LOAD_TRAIT_LIST = 'BEFORE_LOAD_TRAIT_LIST'
export const LOAD_TRAIT_LIST_SUCCESS = 'LOAD_TRAIT_LIST_SUCCESS'
export const LOAD_TRAIT_LIST_FAILURE = 'LOAD_TRAIT_LIST_FAILURE'
export function loadTraitList(condition) {

    let {layer_id} = condition;

    condition = removeValueEmpty(condition);
    delete condition.login_user_id;
    var hash = getHashByData(condition)

    console.log('debug03,hash',hash)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_TRAIT_LIST', 'LOAD_TRAIT_LIST_SUCCESS', 'LOAD_TRAIT_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['image_trait',layer_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/image/trait/list',
                'data'    : condition
            })
        },

        data_format : (result) => {
            var output = normalize(result.data, imageTraitListSchema)
            return output
        },


        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },
        payload: {
            layer_id
        }
    };
}



//添加
export const BEFORE_ADD_TRAIT  = 'BEFORE_ADD_TRAIT'
export const ADD_TRAIT_SUCCESS = 'ADD_TRAIT_SUCCESS'
export const ADD_TRAIT_FAILURE = 'ADD_TRAIT_FAILURE'

export function addTrait(data) {
    // var hash = getHashByData(data)
    // console.log('addTrait',data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_ADD_TRAIT', 'ADD_TRAIT_SUCCESS', 'ADD_TRAIT_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['trait','is_adding']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/add',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (data) => normalize(data.data, imageTraitSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            ...data
        }
    };
}


//添加
export const BEFORE_UPDATE_TRAIT  = 'BEFORE_UPDATE_TRAIT'
export const UPDATE_TRAIT_SUCCESS = 'UPDATE_TRAIT_SUCCESS'
export const UPDATE_TRAIT_FAILURE = 'UPDATE_TRAIT_FAILURE'

export function updateTrait(trait_id,data) {
    // var hash = getHashByData(data)

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_TRAIT', 'UPDATE_TRAIT_SUCCESS', 'UPDATE_TRAIT_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['trait','is_updating',trait_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/update',
                'method' : 'PATCH', 
                'data'   : {
                    id:trait_id,
                    ...data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageTraitSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    'save success',
            'error'     :    true
        },
        payload: {
            'trait_id' : trait_id
        }
    };
}


//添加
export const BEFORE_SORT_TRAIT  = 'BEFORE_SORT_TRAIT'
export const SORT_TRAIT_SUCCESS = 'SORT_TRAIT_SUCCESS'
export const SORT_TRAIT_FAILURE = 'SORT_TRAIT_FAILURE'

export function sortTrait(data,group_id) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_SORT_TRAIT', 'SORT_TRAIT_SUCCESS', 'SORT_TRAIT_FAILURE'],
        // 检查缓存 (可选):
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/sort',
                'method' : 'POST', 
                'data'   : {
                    trait_ids : data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageTraitListSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            group_id : group_id,
            data : data
        }
    };
}


//载入
export const BEFORE_LOAD_TRAIT  = 'BEFORE_LOAD_TRAIT'
export const LOAD_TRAIT_SUCCESS = 'LOAD_TRAIT_SUCCESS'
export const LOAD_TRAIT_FAILURE = 'LOAD_TRAIT_FAILURE'

export function loadTrait(cond) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_TRAIT', 'LOAD_TRAIT_SUCCESS', 'LOAD_TRAIT_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            let check;
            if (cond.name) {
                check = state.getIn(['trait','map_name',cond.name,'is_fetching'])
            }else {
                check = state.getIn(['trait','map_id',cond.id,'is_fetching'])
            }
            return !check
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/load',
                'method' : 'GET', 
                'data'   : cond
            })
        },
        data_format : (data) => normalize(data.data, imageTraitSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },
        payload: {
            'name' : cond.name,
            'id'   : cond.id 
        }
    };
}


//载入
export const BEFORE_DELETE_TRAIT  = 'BEFORE_DELETE_TRAIT'
export const DELETE_TRAIT_SUCCESS = 'DELETE_TRAIT_SUCCESS'
export const DELETE_TRAIT_FAILURE = 'DELETE_TRAIT_FAILURE'

export function deleteTrait(trait_id) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_DELETE_TRAIT', 'DELETE_TRAIT_SUCCESS', 'DELETE_TRAIT_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['trait',trait_id,'is_deleting']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/delete',
                'method' : 'DELETE', 
                'is_api' : false,
                'data'   : {
                    'id' : trait_id
                }
            })
        },
        data_format : (data) => normalize(data.data, imageTraitSchema),

        show_status : {
            'loading'   :    true,
            'success'   :    "delete success",
            'error'     :    true
        },
        payload: {
            'trait_id' : trait_id
        }
    };
}


export function initTrait(trait_id,response) {
    console.log('debug008,call init trait');
    return {
        type             : LOAD_TRAIT_SUCCESS,
        payload : {
            trait_id         : trait_id,
            response        : response
        }
    }
}

//添加
export const BEFORE_UPDATE_TRAIT_PROBABILITY  = 'BEFORE_UPDATE_TRAIT_PROBABILITY'
export const UPDATE_TRAIT_PROBABILITY_SUCCESS = 'UPDATE_TRAIT_PROBABILITY_SUCCESS'
export const UPDATE_TRAIT_PROBABILITY_FAILURE = 'UPDATE_TRAIT_PROBABILITY_FAILURE'

export function updateTraitProbability(data) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_TRAIT_PROBABILITY', 'UPDATE_TRAIT_PROBABILITY_SUCCESS', 'UPDATE_TRAIT_PROBABILITY_FAILURE'],
        // 检查缓存 (可选):
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/trait/update_probability',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (data) => normalize(data.data, imageTraitListSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
        }
    };
}



export function reducer(state = Immutable.fromJS({
    'is_updating' : {},
    'list'  : {},
    'map'   : {},
}), action) {
    switch (action.type) {

        case BEFORE_SORT_TRAIT:
            return state.setIn(['list',action.payload.layer_id,'list'],Immutable.List(action.payload.data))
        
        case SORT_TRAIT_SUCCESS:
            return state.setIn(['list',action.payload.layer_id,'list'],Immutable.List(action.payload.response.result))

        case BEFORE_ADD_TRAIT:
            return state.setIn(['is_adding'],true)

        case ADD_TRAIT_SUCCESS:
            return state.setIn(['is_adding'],false)
                .updateIn(['list',action.payload.layer_id,'list'],list=>{
                    if (!list.includes(action.payload.response.result)){
                        return list.unshift(action.payload.response.result)
                    }else {
                        return list;
                    }
                })

        case ADD_TRAIT_FAILURE:
            return state.setIn(['is_adding'],false)

        case BEFORE_UPDATE_TRAIT:
            return state.setIn(['is_updating',action.trait_id],true)

        case UPDATE_TRAIT_SUCCESS:
        case UPDATE_TRAIT_FAILURE:
            return state.deleteIn(['is_updating',action.trait_id])

        case BEFORE_LOAD_TRAIT:
            return state.setIn(['map_id',action.payload.id,'is_fetching'],true)

        case LOAD_TRAIT_SUCCESS:
            return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                return list_data.merge({
                    'is_fetching' : false,
                    'result'     : action.payload.response.result,
                    'is_fetched' : true
                })
            })

        case LOAD_TRAIT_FAILURE:
            return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                return list_data.merge({
                    'is_fetching' : false,
                    'result'     : null,
                    'is_fetched' : true
                })
            })

       case BEFORE_LOAD_TRAIT_LIST:
            if (!state.getIn(['list',action.payload.layer_id])) {
                state = state.setIn(['list',action.payload.layer_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.layer_id,'is_fetching'],true)
            .setIn(['list',action.payload.layer_id,'is_fetched'],false)

        case LOAD_TRAIT_LIST_SUCCESS:
            return state.setIn(['list',action.payload.layer_id,'is_fetching'],false)
            .setIn(['list',action.payload.layer_id,'is_fetched'],true)
            .setIn(['list',action.payload.layer_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_TRAIT_LIST_FAILURE:
            return state.setIn(['list',action.payload.layer_id,'is_fetching'],false)
            .setIn(['list',action.payload.layer_id,'is_fetched'],false)

        case BEFORE_DELETE_TRAIT:
            return state.setIn([action.payload.trait_id,'is_deleting'],true)

        case DELETE_TRAIT_SUCCESS:
        case DELETE_TRAIT_FAILURE:
            return state.setIn([action.payload.trait_id,'is_deleting'],false)


        default:
            return state
    }
}


