import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { getHashByData,removeValueEmpty} from 'helper/common'

import { imageLayerListSchema , imageLayerSchema } from 'redux/schema/index'



export const BEFORE_LOAD_LAYER_LIST = 'BEFORE_LOAD_LAYER_LIST'
export const LOAD_LAYER_LIST_SUCCESS = 'LOAD_LAYER_LIST_SUCCESS'
export const LOAD_LAYER_LIST_FAILURE = 'LOAD_LAYER_LIST_FAILURE'
export function loadLayerList(condition) {

    let {group_id} = condition;

    condition = removeValueEmpty(condition);
    delete condition.login_user_id;
    var hash = getHashByData(condition)

    console.log('debug03,hash',hash)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_LAYER_LIST', 'LOAD_LAYER_LIST_SUCCESS', 'LOAD_LAYER_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['image_layer',group_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/image/layer/list',
                'data'    : condition
            })
        },

        data_format : (result) => {
            var output = normalize(result.data, imageLayerListSchema)
            return output
        },


        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    false
        },
        payload: {
            group_id
        }
    };
}



//添加
export const BEFORE_ADD_LAYER  = 'BEFORE_ADD_LAYER'
export const ADD_LAYER_SUCCESS = 'ADD_LAYER_SUCCESS'
export const ADD_LAYER_FAILURE = 'ADD_LAYER_FAILURE'

export function addLayer(data) {
    // var hash = getHashByData(data)
    console.log('addLayer',data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_ADD_LAYER', 'ADD_LAYER_SUCCESS', 'ADD_LAYER_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['layer','is_adding']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/layer/add',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (data) => normalize(data.data, imageLayerSchema),

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
export const BEFORE_UPDATE_LAYER  = 'BEFORE_UPDATE_LAYER'
export const UPDATE_LAYER_SUCCESS = 'UPDATE_LAYER_SUCCESS'
export const UPDATE_LAYER_FAILURE = 'UPDATE_LAYER_FAILURE'

export function updateLayer(layer_id,data) {
    // var hash = getHashByData(data)

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_LAYER', 'UPDATE_LAYER_SUCCESS', 'UPDATE_LAYER_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['layer','is_updating',layer_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/layer/update',
                'method' : 'PATCH', 
                'data'   : {
                    id:layer_id,
                    ...data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageLayerSchema),

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        payload: {
            'layer_id' : layer_id
        }
    };
}


//添加
export const BEFORE_SORT_LAYER  = 'BEFORE_SORT_LAYER'
export const SORT_LAYER_SUCCESS = 'SORT_LAYER_SUCCESS'
export const SORT_LAYER_FAILURE = 'SORT_LAYER_FAILURE'

export function sortLayer(data,group_id) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_SORT_LAYER', 'SORT_LAYER_SUCCESS', 'SORT_LAYER_FAILURE'],
        // 检查缓存 (可选):
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/layer/sort',
                'method' : 'POST', 
                'data'   : {
                    layer_ids : data
                }
            })
        },
        data_format : (data) => normalize(data.data, imageLayerListSchema),

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
export const BEFORE_LOAD_LAYER  = 'BEFORE_LOAD_LAYER'
export const LOAD_LAYER_SUCCESS = 'LOAD_LAYER_SUCCESS'
export const LOAD_LAYER_FAILURE = 'LOAD_LAYER_FAILURE'

export function loadLayer(cond) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_LAYER', 'LOAD_LAYER_SUCCESS', 'LOAD_LAYER_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            let check;
            if (cond.name) {
                check = state.getIn(['layer','map_name',cond.name,'is_fetching'])
            }else {
                check = state.getIn(['layer','map_id',cond.id,'is_fetching'])
            }
            return !check
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/layer/load',
                'method' : 'GET', 
                'data'   : cond
            })
        },
        data_format : (data) => normalize(data.data, imageLayerSchema),

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
export const BEFORE_DELETE_LAYER  = 'BEFORE_DELETE_LAYER'
export const DELETE_LAYER_SUCCESS = 'DELETE_LAYER_SUCCESS'
export const DELETE_LAYER_FAILURE = 'DELETE_LAYER_FAILURE'

export function deleteLayer(layer_id) {

    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_DELETE_LAYER', 'DELETE_LAYER_SUCCESS', 'DELETE_LAYER_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => { 
            if (state.getIn(['layer',layer_id,'is_deleting']) == true) {
                return false;
            }else {
                return true;
            }
        },
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/image/layer/delete',
                'method' : 'DELETE', 
                'is_api' : false,
                'data'   : {
                    'id' : layer_id
                }
            })
        },
        // data_format : (data) => normalize(data, imageLayerSchema),

        show_status : {
            'loading'   :    true,
            'success'   :    "delete success",
            'error'     :    true
        },
        payload: {
            'layer_id' : layer_id
        }
    };
}


export function initLayer(layer_id,response) {
    console.log('debug008,call init layer');
    return {
        type             : LOAD_LAYER_SUCCESS,
        payload : {
            layer_id         : layer_id,
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

        case BEFORE_SORT_LAYER:
            return state.setIn(['list',action.payload.group_id,'list'],Immutable.List(action.payload.data))
        
        case SORT_LAYER_SUCCESS:
            return state.setIn(['list',action.payload.group_id,'list'],Immutable.List(action.payload.response.result))

        case BEFORE_ADD_LAYER:
            return state.setIn(['is_adding'],true)

        case ADD_LAYER_SUCCESS:
        case ADD_LAYER_FAILURE:
            return state.setIn(['is_adding'],false)

        case BEFORE_UPDATE_LAYER:
            return state.setIn(['is_updating',action.layer_id],true)

        case UPDATE_LAYER_SUCCESS:
        case UPDATE_LAYER_FAILURE:
            return state.deleteIn(['is_updating',action.layer_id])

        case BEFORE_LOAD_LAYER:
            return state.setIn(['map_id',action.payload.id,'is_fetching'],true)

        case LOAD_LAYER_SUCCESS:
            return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                return list_data.merge({
                    'is_fetching' : false,
                    'result'     : action.payload.response.result,
                    'is_fetched' : true
                })
            })

        case LOAD_LAYER_FAILURE:
            return state.updateIn(['map_id',action.payload.id],(list_data)=>{
                return list_data.merge({
                    'is_fetching' : false,
                    'result'     : null,
                    'is_fetched' : true
                })
            })

       case BEFORE_LOAD_LAYER_LIST:
            if (!state.getIn(['list',action.payload.group_id])) {
                state = state.setIn(['list',action.payload.group_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.group_id,'is_fetching'],true)
            .setIn(['list',action.payload.group_id,'is_fetched'],false)

        case LOAD_LAYER_LIST_SUCCESS:
            return state.setIn(['list',action.payload.group_id,'is_fetching'],false)
            .setIn(['list',action.payload.group_id,'is_fetched'],true)
            .setIn(['list',action.payload.group_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_LAYER_LIST_FAILURE:
            return state.setIn(['list',action.payload.group_id,'is_fetching'],false)
            .setIn(['list',action.payload.group_id,'is_fetched'],false)

        case BEFORE_DELETE_LAYER:
            return state.setIn([action.layer_id,'is_deleting'],true)

        case DELETE_LAYER_SUCCESS:
        case DELETE_LAYER_FAILURE:
            return state.setIn([action.layer_id,'is_deleting'],false)



        default:
            return state
    }
}


