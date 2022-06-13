import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { removeValueEmpty} from 'helper/common'
import { galleryListSchema } from 'redux/schema/index'

export const BEFORE_LOAD_GALLERY_LIST = 'BEFORE_LOAD_GALLERY_LIST'
export const LOAD_GALLERY_LIST_SUCCESS = 'LOAD_GALLERY_LIST_SUCCESS'
export const LOAD_GALLERY_LIST_FAILURE = 'LOAD_GALLERY_LIST_FAILURE'

export function loadGalleryList(condition) {
    console.log('debug05,condition',condition)
    condition = removeValueEmpty(condition);
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_GALLERY_LIST', 'LOAD_GALLERY_LIST_SUCCESS', 'LOAD_GALLERY_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['gallery','list',condition.club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/gallery/list',
                'data'    : condition
            })
        },

        data_format : (result) => {

            var output = normalize(result.data, galleryListSchema)
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
export const BEFORE_SAVE_GALLERY  = 'BEFORE_SAVE_GALLERY'
export const SAVE_GALLERY_SUCCESS = 'SAVE_GALLERY_SUCCESS'
export const SAVE_GALLERY_FAILURE = 'SAVE_GALLERY_FAILURE'

export function saveGalleryList(data) {
    // var hash = getHashByData(data)
    console.log('debug05,addGallery',data)
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_SAVE_GALLERY', 'SAVE_GALLERY_SUCCESS', 'SAVE_GALLERY_FAILURE'],
        // 检查缓存 (可选):
        // shouldCallAPI:  (state) => !state.getIn(['gallery','updating',data.club_id]),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'url'    : '/v1/gallery/save',
                'method' : 'POST', 
                'data'   : data
            })
        },
        data_format : (result) => {
            console.log('result',result)
            return normalize(result.data, galleryListSchema)
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

        case BEFORE_SAVE_GALLERY:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],true)

        case SAVE_GALLERY_SUCCESS:
        case SAVE_GALLERY_FAILURE:
            return state.setIn(['updating',action.payload.club_id,'is_saving'],false)

       case BEFORE_LOAD_GALLERY_LIST:
            if (!state.getIn(['list',action.payload.club_id,'list'])) {
                state = state.setIn(['list',action.payload.club_id,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.club_id,'is_fetching'],true)
            .setIn(['list',action.payload.club_id,'is_fetched'],false)

        case LOAD_GALLERY_LIST_SUCCESS:
            return state.setIn(['list',action.payload.club_id,'is_fetching'],false)
            .setIn(['list',action.payload.club_id,'is_fetched'],true)
            .setIn(['list',action.payload.club_id,'list'],Immutable.List(action.payload.response.result))

        case LOAD_GALLERY_LIST_FAILURE:
            return state.setIn([action.payload.club_id,'is_fetching'],false)


        default:
            return state
    }
}


