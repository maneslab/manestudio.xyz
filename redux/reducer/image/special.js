import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { getHashByData,removeValueEmpty} from 'helper/common'

import { imageSpecialListSchema , imageSpecialSchema } from 'redux/schema/index'


export const BEFORE_LOAD_SPECIAL_LIST = 'BEFORE_LOAD_SPECIAL_LIST'
export const LOAD_SPECIAL_LIST_SUCCESS = 'LOAD_SPECIAL_LIST_SUCCESS'
export const LOAD_SPECIAL_LIST_FAILURE = 'LOAD_SPECIAL_LIST_FAILURE'
export function loadSpecialList(condition) {

    let {club_id} = condition;


    condition = removeValueEmpty(condition);
    delete condition.login_user_id;
    var hash = getHashByData(condition)

    console.log('debug03,hash',hash)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_SPECIAL_LIST', 'LOAD_SPECIAL_LIST_SUCCESS', 'LOAD_SPECIAL_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['image_special',club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/image/special/list',
                'data'    : condition
            })
        },

        data_format : (result) => {
            var output = normalize(result.data, imageSpecialListSchema)
            return output
        },


        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },
        payload: {
            club_id : club_id
        }
    };
}



//添加
export const BEFORE_ADD_SPECIAL  = 'BEFORE_ADD_SPECIAL'
export const ADD_SPECIAL_SUCCESS = 'ADD_SPECIAL_SUCCESS'
export const ADD_SPECIAL_FAILURE = 'ADD_SPECIAL_FAILURE'

export function addSpecial(data) {
    // var hash = getHashByData(data)
    console.log('addSpecial',data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_ADD_SPECIAL', 'ADD_SPECIAL_SUCCESS', 'ADD_SPECIAL_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['special','is_adding']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/special/add',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (data) => normalize(data.data, imageSpecialSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
        }
    };
}


//添加
export const BEFORE_UPDATE_SPECIAL  = 'BEFORE_UPDATE_SPECIAL'
export const UPDATE_SPECIAL_SUCCESS = 'UPDATE_SPECIAL_SUCCESS'
export const UPDATE_SPECIAL_FAILURE = 'UPDATE_SPECIAL_FAILURE'

export function updateSpecial(special_id,data) {
    // var hash = getHashByData(data)

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_SPECIAL', 'UPDATE_SPECIAL_SUCCESS', 'UPDATE_SPECIAL_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['special','is_updating',special_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/special/update',
                'method' : 'PATCH', 
                'data'   : {
                    id:special_id,
                    ...data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageSpecialSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            'special_id' : special_id
        }
    };
}





//载入
export const BEFORE_LOAD_SPECIAL  = 'BEFORE_LOAD_SPECIAL'
export const LOAD_SPECIAL_SUCCESS = 'LOAD_SPECIAL_SUCCESS'
export const LOAD_SPECIAL_FAILURE = 'LOAD_SPECIAL_FAILURE'

export function loadSpecial(cond) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_SPECIAL', 'LOAD_SPECIAL_SUCCESS', 'LOAD_SPECIAL_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            let check;
            if (cond.name) {
                check = state.getIn(['special','map_name',cond.name,'is_fetching'])
            }else {
                check = state.getIn(['special','map_id',cond.id,'is_fetching'])
            }
            return !check
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/special/load',
                'method' : 'GET', 
                'data'   : cond
            })
        },
        data_format : (data) => normalize(data.data, imageSpecialSchema),

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
export const BEFORE_DELETE_SPECIAL  = 'BEFORE_DELETE_SPECIAL'
export const DELETE_SPECIAL_SUCCESS = 'DELETE_SPECIAL_SUCCESS'
export const DELETE_SPECIAL_FAILURE = 'DELETE_SPECIAL_FAILURE'

export function deleteSpecial(special_id) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_DELETE_SPECIAL', 'DELETE_SPECIAL_SUCCESS', 'DELETE_SPECIAL_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['special',special_id,'is_deleting']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/special/delete',
                'method' : 'DELETE', 
                'is_api' : false,
                'data'   : {
                    'id' : special_id
                }
            })
        },
        // data_format : (data) => normalize(data, imageSpecialSchema),

        show_status : {
            'loading'   :    true,
            'success'   :    "delete success",
            'error'     :    true
        },
        payload: {
            'special_id' : special_id
        }
    };
}


export function initSpecial(special_id,response) {
    console.log('debug008,call init special');
    return {
        type             : LOAD_SPECIAL_SUCCESS,
        payload : {
            special_id         : special_id,
            response        : response
        }
    }
}



export function reducer(state = Immutable.fromJS({
    'map_name' : {},
    'map_id'   : {},
    'is_updating' : {},
    'list'  : {},
    'map'   : {},
}), action) {
    switch (action.type) {

        case BEFORE_ADD_SPECIAL:
            return state.setIn(['is_adding'],true)

        case ADD_SPECIAL_SUCCESS:
        case ADD_SPECIAL_FAILURE:
            return state.setIn(['is_adding'],false)

        case BEFORE_UPDATE_SPECIAL:
            return state.setIn(['is_updating',action.special_id],true)

        case UPDATE_SPECIAL_SUCCESS:
        case UPDATE_SPECIAL_FAILURE:
            return state.deleteIn(['is_updating',action.special_id])

        case BEFORE_LOAD_SPECIAL:
            if (action.payload.name) {
                return state.setIn(['map_name',action.payload.name,'is_fetching'],true)
            }else {
                return state.setIn(['map_id',action.payload.id,'is_fetching'],true)
            }

        case LOAD_SPECIAL_SUCCESS:
            if (action.payload.name) {
                return state.updateIn(['map_name',action.payload.name],(list_data)=>{
                    return list_data.merge({
                        'is_fetching' : false,
                        'result'     : action.payload.response.result,
                        'is_fetched' : true
                    })
                })
            }else {
                return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                    return list_data.merge({
                        'is_fetching' : false,
                        'result'     : action.payload.response.result,
                        'is_fetched' : true
                    })
                })
            }

        case LOAD_SPECIAL_FAILURE:
            if (action.payload.name) {
                return state.updateIn(['map_name',action.payload.name],(list_data)=>{
                    return list_data.merge({
                        'is_fetching' : false,
                        'result'     : null,
                        'is_fetched' : true
                    })
                })
            }else {
                return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                    return list_data.merge({
                        'is_fetching' : false,
                        'result'     : null,
                        'is_fetched' : true
                    })
                })
            }

       case BEFORE_LOAD_SPECIAL_LIST:
            if (!state.getIn(['list',action.payload.club_id])) {
                state = state.setIn(['list',action.payload.club_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.club_id,'is_fetching'],true)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case LOAD_SPECIAL_LIST_SUCCESS:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],true)
            .setIn(['list',action.payload.club_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_SPECIAL_LIST_FAILURE:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case BEFORE_DELETE_SPECIAL:
            return state.setIn([action.special_id,'is_deleting'],true)

        case DELETE_SPECIAL_SUCCESS:
        case DELETE_SPECIAL_FAILURE:
            return state.setIn([action.special_id,'is_deleting'],false)


        default:
            return state
    }
}


