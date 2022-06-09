import Immutable from "immutable";

import {setJwtToken,getCookie} from 'helper/cookie';
import {httpRequest} from 'helper/http'
import {userSchema} from 'redux/schema/index';
import { normalize, schema } from 'normalizr';


export const BEFORE_LOGIN = 'BEFORE_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const BEFORE_LOGOUT = 'BEFORE_LOGOUT';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// export function fakeLoginUser(condition) {
//     return {
//         // 要在之前和之后发送的 action types
//         types: [BEFORE_LOGIN, LOGIN_SUCCESS, LOGIN_FAILED],
//         // 检查缓存 (可选):
//         shouldCallAPI:  (state) => !state.getIn(['user','is_login_ing']),
//         // 进行取：
//         callAPI: () => {

//             return httpRequest({
//                 'method'  : 'POST',
//                 'url'     : '/v1/user/fake_login',
//                 'data'    : condition
//             })


//         },
//         data_format : (result) => {
//             setJwtToken(result.data.jwt_token);
//             var output = normalize(result.data.login_user, userSchema)
//             return output
//         },

//         show_status : {
//             'loading'   :    false,
//             'success'   :    false,
//             'error'     :    true
//         },
//         // 在 actions 的开始和结束注入的参数
//         payload: {
//         }
//     };
// }


export function loginUser(condition) {
    console.log('loginUser',condition)

    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_LOGIN, LOGIN_SUCCESS, LOGIN_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['user','is_login_ing']),
        // 进行取：
        callAPI: () => {

            return httpRequest({
                'method'  : 'POST',
                'url'     : '/v1/user/login',
                'data'    : condition
            })


        },
        data_format : (result) => {
            console.log('loginUser,result',result)

            if (result.data.jwt_token) {
                setJwtToken(result.data.jwt_token);
                var output = normalize(result.data.login_user, userSchema)
                return output
            }else {
                return null
            }
            
            
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        // 在 actions 的开始和结束注入的参数
        payload: {
        }
    };
}




export function logoutUser() {
    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['user','is_logout_ing']),
        // 进行取：
        callAPI: () => {

            return httpRequest({
                'method'  : 'POST',
                'url'     : '/v1/user/logout',
            })


        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        // 在 actions 的开始和结束注入的参数
        payload: {
        }
    };
}



//添加
export const BEFORE_UPDATE_USER  = 'BEFORE_UPDATE_USER'
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE'

export function updateUser(data) {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_UPDATE_USER', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['user','is_updating']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/user/update',
                'method' : 'PATCH', 
                'data'   : {
                    ...data
                }
            })
        },
        data_format : (data) => normalize(data.data, userSchema),

        show_status : {
            'loading'   :    '修改中',
            'success'   :    '修改成功',
            'error'     :    true
        },
        payload: {
        }
    };
}


export const BEFORE_LOAD_USER = 'BEFORE_LOAD_USER';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILED = 'LOAD_USER_FAILED';

export function loadUser(user_id) {

    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_LOAD_USER, LOAD_USER_SUCCESS, LOAD_USER_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI: (state)=> !state.getIn(['user','is_loading',user_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/user/load',
                'data'    : {
                    'user_id' : user_id
                }
            })


        },
        data_format : (result) => {
            if (result.status == 'success') {
                let output = normalize(result.data, userSchema)
                return output
            }
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        // 在 actions 的开始和结束注入的参数
        payload: {
            user_id : user_id,
        }
    };
}


export const INIT_USER = 'INIT_USER'
export function initUser(data) {
    let response = normalize(data, userSchema);
    return {
        type       : 'MERGE_ENTITES',
        payload    : response.entities
    }
}


export const BEFORE_LOAD_LOGIN_USER = 'BEFORE_LOAD_LOGIN_USER';
export const LOAD_LOGIN_USER_SUCCESS = 'LOAD_LOGIN_USER_SUCCESS';
export const LOAD_LOGIN_USER_FAILED = 'LOAD_LOGIN_USER_FAILED';

export function loadLoginUser() {

    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_LOAD_LOGIN_USER, LOAD_LOGIN_USER_SUCCESS, LOAD_LOGIN_USER_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI: (state)=> !state.getIn(['user','login_user','is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/init/login_user',
            })
        },
        data_format : (result) => {
            const tempSchame = new schema.Object({ login_user: userSchema });
            var output = normalize(result.data, tempSchame)
            return output
        },
        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },
        // 在 actions 的开始和结束注入的参数
        payload: {
        }
    };
}


export function reducer(state = Immutable.fromJS({
    'login_user'    : {
        'is_fetching' : false,
        'is_fetched'  : false,
    },
    'is_login_ing'      : false,
    'is_logout_ing'     : false,
    'is_updating'       : false,
}), action) {
    switch (action.type) {

        case BEFORE_LOAD_LOGIN_USER:
            return state.setIn(['login_user','is_fetching'],true);

        case LOAD_LOGIN_USER_SUCCESS:
            return state.setIn(['login_user','is_fetching'],false)
            .setIn(['login_user','is_fetched'],true);

        case LOAD_LOGIN_USER_FAILED:
            return state.setIn(['login_user','is_fetching'],false)


        case BEFORE_UPDATE_USER:
            return state.set('is_updating',true);

        case UPDATE_USER_SUCCESS:
        case UPDATE_USER_FAILURE:
            return state.set('is_updating',false);

        case BEFORE_LOGIN:
            return state.set('is_login_ing',true);

        case LOGIN_SUCCESS:
        case LOGIN_FAILED:
            return state.set('is_login_ing',false);

        case BEFORE_LOGOUT:
            return state.set('is_logout_ing',true);

        case LOGOUT_SUCCESS:
        case LOGOUT_FAILED:
            return state.set('is_logout_ing',false);

        case BEFORE_LOAD_USER:
            return state
                .setIn(['is_loading',action.payload.user_id],true)

        case LOAD_USER_SUCCESS:
        case LOAD_USER_FAILED:
            return state
                .deleteIn(['is_loading',action.payload.user_id])

        default:
            return state
    }
}
