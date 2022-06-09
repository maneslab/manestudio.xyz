import Immutable from "immutable";

import {LOGIN_SUCCESS,LOGOUT_SUCCESS,LOAD_LOGIN_USER_SUCCESS} from 'redux/reducer/user'
import {createAction} from 'helper/common'
import {httpRequest} from 'helper/http'

import {userSchema} from 'redux/schema/index';
import { normalize, schema } from 'normalizr';



export const INIT_LOGIN_USER = 'INIT_LOGIN_USER'
export const initLoginUser = createAction('INIT_LOGIN_USER');

export const SET_GLOBAL_MODAL = 'SET_GLOBAL_MODAL'
export const setGlobalModal = createAction('SET_GLOBAL_MODAL');

export const SET_ACTIVE_CLUB_ID = 'SET_ACTIVE_CLUB_ID'
export const setActiveClub = createAction('SET_ACTIVE_CLUB_ID');


export const SET_SETTING = 'SET_SETTING'
export const setSetting = (payload) => {
    return {
        'type'      : SET_SETTING,
        'payload'   : {
            name  : payload.name,
            value : payload.value,
        }
    }
}
export const TOGGLE_SETTING = 'TOGGLE_SETTING'
export const toggleSetting = (name) => {
    return {
        'type'      : TOGGLE_SETTING,
        'payload'   : {
            name,
        }
    }
}

export const SET_SLIDER = 'SET_SLIDER'
export const setSlider = createAction('SET_SLIDER');

export const SET_LANGUAGE = 'SET_LANGUAGE'
export const setLanguage = createAction('SET_LANGUAGE');


export const loginSuccess = createAction('LOGIN_SUCCESS');
export const mergeEntities = createAction('MERGE_ENTITES');
export const logoutSuccess = createAction('LOGOUT_SUCCESS');


export const BEFORE_INIT = 'BEFORE_INIT'
export const beforeInit = createAction('BEFORE_INIT');

export const AFTER_INIT = 'AFTER_INIT'
export const afterInit = createAction('AFTER_INIT');


export const BEFORE_INIT_APP = 'BEFORE_INIT_APP';
export const INIT_APP_SUCCESS = 'INIT_APP_SUCCESS';
export const INIT_APP_FAILED = 'INIT_APP_FAILED';

export function initApp() {

    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_INIT_APP, INIT_APP_SUCCESS, INIT_APP_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI: (state)=> !state.getIn(['setting','is_initing']),
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

            // return result.data;
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


export const BEFORE_LOAD_STATUS = 'BEFORE_LOAD_STATUS';
export const LOAD_STATUS_SUCCESS = 'LOAD_STATUS_SUCCESS';
export const LOAD_STATUS_FAILED = 'LOAD_STATUS_FAILED';

export function loadStatus() {

    return {
        // 要在之前和之后发送的 action types
        types: [BEFORE_LOAD_STATUS, LOAD_STATUS_SUCCESS, LOAD_STATUS_FAILED],
        // 检查缓存 (可选):
        shouldCallAPI: (state)=> !state.getIn(['setting','status','is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/status',
            })


        },
        data_format : (result) => {
            return result.data;
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
    'active_club_id'        : null,
    'language'              : 'en',
    'global_modal'          : null,
    'login_user'            : null,
    'is_initing'            : false,
    'is_inited'             : false,
    'slider'                : true,
}), action) {

    switch (action.type) {

        case SET_ACTIVE_CLUB_ID:
            return state.setIn(['active_club_id'],action.payload);

        case BEFORE_INIT_APP:
            return state.setIn(['is_initing'],true)

        case INIT_APP_SUCCESS:
            return state
            .setIn(['is_initing'],false)
            .setIn(['is_inited'],true)
            .set('login_user',action.payload.response.result.login_user)

        case LOAD_LOGIN_USER_SUCCESS:
            return state.set('login_user',action.payload.response.result.login_user)

        case INIT_APP_FAILED:
            return state.setIn(['is_initing'],false)

        case BEFORE_LOAD_STATUS:
            return state.setIn(['status','is_fetching'],true);

        case LOAD_STATUS_SUCCESS:
            return state.setIn(['status','is_fetching'],false)
            .setIn(['status','is_fetched'],true)
            .setIn(['status','wallet_count'],action.payload.response.wallet_count)
            .setIn(['status','draw_count'],action.payload.response.draw_count)
            .setIn(['status','user_draw_count',action.payload.response.user_draw_count]);

        case LOAD_STATUS_FAILED:
            return state.setIn(['status','is_fetching'],false);


        case SET_SLIDER:
            return state.setIn(['slider'],action.payload);


        case SET_SETTING:
            return state.setIn([action.payload.name],action.payload.value);

        case TOGGLE_SETTING:
            var v = state.getIn([action.payload.name]);
            return state.setIn([action.payload.name],!v);

        case SET_LANGUAGE:
            return state.setIn(['language'],action.payload.toLowerCase());

        case SET_GLOBAL_MODAL:
            return state.setIn(['global_modal'],action.payload);

        case LOGIN_SUCCESS:
            if (action.payload && action.payload.response && action.payload.response.result) {
                return state.setIn(['login_user'],action.payload.response.result).setIn(['global_modal'],null);
            }else {
                return state;
            }

        case INIT_LOGIN_USER:
            return state.setIn(['login_user'],action.payload.result);

        case LOGOUT_SUCCESS:
            return state.setIn(['login_user'],null);

        case BEFORE_INIT:
            return state.setIn(['is_inited'],false)
                .setIn(['is_initing'],true);

        case AFTER_INIT:
            return state.setIn(['is_inited'],true)
                .setIn(['is_initing'],false);


        default:
            return state
    }
}

