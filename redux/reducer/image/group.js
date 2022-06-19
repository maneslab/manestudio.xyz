import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { getHashByData,removeValueEmpty} from 'helper/common'

import { imageGroupListSchema , imageGroupSchema } from 'redux/schema/index'


export const BEFORE_LOAD_GROUP_LIST = 'BEFORE_LOAD_GROUP_LIST'
export const LOAD_GROUP_LIST_SUCCESS = 'LOAD_GROUP_LIST_SUCCESS'
export const LOAD_GROUP_LIST_FAILURE = 'LOAD_GROUP_LIST_FAILURE'
export function loadGroupList(condition) {

    let {club_id} = condition;


    condition = removeValueEmpty(condition);
    delete condition.login_user_id;
    var hash = getHashByData(condition)

    console.log('debug03,hash',hash)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_GROUP_LIST', 'LOAD_GROUP_LIST_SUCCESS', 'LOAD_GROUP_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['image_group',club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/image/group/list',
                'data'    : condition
            })
        },

        data_format : (result) => {
            var output = normalize(result.data, imageGroupListSchema)
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
export const BEFORE_ADD_GROUP  = 'BEFORE_ADD_GROUP'
export const ADD_GROUP_SUCCESS = 'ADD_GROUP_SUCCESS'
export const ADD_GROUP_FAILURE = 'ADD_GROUP_FAILURE'

export function addGroup(data) {
    // var hash = getHashByData(data)
    console.log('addGroup',data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_ADD_GROUP', 'ADD_GROUP_SUCCESS', 'ADD_GROUP_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['group','is_adding']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/group/add',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (data) => normalize(data.data, imageGroupSchema),

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
export const BEFORE_UPDATE_GROUP  = 'BEFORE_UPDATE_GROUP'
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS'
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE'

export function updateGroup(group_id,data) {
    // var hash = getHashByData(data)

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_GROUP', 'UPDATE_GROUP_SUCCESS', 'UPDATE_GROUP_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['group','is_updating',group_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/group/update',
                'method' : 'PATCH', 
                'data'   : {
                    id:group_id,
                    ...data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageGroupSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            'group_id' : group_id
        }
    };
}





//载入
export const BEFORE_LOAD_GROUP  = 'BEFORE_LOAD_GROUP'
export const LOAD_GROUP_SUCCESS = 'LOAD_GROUP_SUCCESS'
export const LOAD_GROUP_FAILURE = 'LOAD_GROUP_FAILURE'

export function loadGroup(cond) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_GROUP', 'LOAD_GROUP_SUCCESS', 'LOAD_GROUP_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            let check;
            if (cond.name) {
                check = state.getIn(['group','map_name',cond.name,'is_fetching'])
            }else {
                check = state.getIn(['group','map_id',cond.id,'is_fetching'])
            }
            return !check
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/group/load',
                'method' : 'GET', 
                'data'   : cond
            })
        },
        data_format : (data) => normalize(data.data, imageGroupSchema),

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
export const BEFORE_DELETE_GROUP  = 'BEFORE_DELETE_GROUP'
export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS'
export const DELETE_GROUP_FAILURE = 'DELETE_GROUP_FAILURE'

export function deleteGroup(group_id) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_DELETE_GROUP', 'DELETE_GROUP_SUCCESS', 'DELETE_GROUP_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['group',group_id,'is_deleting']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/group/delete',
                'method' : 'DELETE', 
                'is_api' : false,
                'data'   : {
                    'id' : group_id
                }
            })
        },
        // data_format : (data) => normalize(data, imageGroupSchema),

        show_status : {
            'loading'   :    true,
            'success'   :    "delete success",
            'error'     :    true
        },
        payload: {
            'group_id' : group_id
        }
    };
}


export function initGroup(group_id,response) {
    console.log('debug008,call init group');
    return {
        type             : LOAD_GROUP_SUCCESS,
        payload : {
            group_id         : group_id,
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

        case BEFORE_ADD_GROUP:
            return state.setIn(['is_adding'],true)

        case ADD_GROUP_SUCCESS:
        case ADD_GROUP_FAILURE:
            return state.setIn(['is_adding'],false)

        case BEFORE_UPDATE_GROUP:
            return state.setIn(['is_updating',action.group_id],true)

        case UPDATE_GROUP_SUCCESS:
        case UPDATE_GROUP_FAILURE:
            return state.deleteIn(['is_updating',action.group_id])

        case BEFORE_LOAD_GROUP:
            if (action.payload.name) {
                return state.setIn(['map_name',action.payload.name,'is_fetching'],true)
            }else {
                return state.setIn(['map_id',action.payload.id,'is_fetching'],true)
            }

        case LOAD_GROUP_SUCCESS:
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

        case LOAD_GROUP_FAILURE:
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

       case BEFORE_LOAD_GROUP_LIST:
            if (!state.getIn(['list',action.payload.club_id])) {
                state = state.setIn(['list',action.payload.club_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.club_id,'is_fetching'],true)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case LOAD_GROUP_LIST_SUCCESS:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],true)
            .setIn(['list',action.payload.club_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_GROUP_LIST_FAILURE:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case BEFORE_DELETE_GROUP:
            return state.setIn([action.group_id,'is_deleting'],true)

        case DELETE_GROUP_SUCCESS:
        case DELETE_GROUP_FAILURE:
            return state.setIn([action.group_id,'is_deleting'],false)


        default:
            return state
    }
}


