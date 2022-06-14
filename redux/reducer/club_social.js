import { normalize } from 'normalizr';
import Immutable from 'immutable';
import {httpRequest} from 'helper/http'
import { removeValueEmpty} from 'helper/common'
import { clubSocialListSchema } from 'redux/schema/index'

export const BEFORE_LOAD_CLUB_SOCIAL_LIST = 'BEFORE_LOAD_CLUB_SOCIAL_LIST'
export const LOAD_CLUB_SOCIAL_LIST_SUCCESS = 'LOAD_CLUB_SOCIAL_LIST_SUCCESS'
export const LOAD_CLUB_SOCIAL_LIST_FAILURE = 'LOAD_CLUB_SOCIAL_LIST_FAILURE'

export function loadClubSocialList(club_id,platform = 'twitter')  {
    return {
        // 要在之前和之后发送的 action types
        types: ['BEFORE_LOAD_CLUB_SOCIAL_LIST', 'LOAD_CLUB_SOCIAL_LIST_SUCCESS', 'LOAD_CLUB_SOCIAL_LIST_FAILURE'],
        // 检查缓存 (可选):
        shouldCallAPI:  (state) => !state.getIn(['club_social','list',club_id,'is_fetching']),
        // 进行取：
        callAPI: () => {
            return httpRequest({
                'method'  : 'GET',
                'url'     : '/v1/club/social/list',
                'data'    : {
                    club_id  : club_id,
                    platform : platform,
                }
            })
        },

        data_format : (result) => {
            var output = normalize(result.data, clubSocialListSchema)
            return output
        },

        show_status : {
            'loading'   :    false,
            'success'   :    false,
            'error'     :    true
        },

        payload: {
            club_id : club_id,
            platform : platform,
            key : club_id + '_' +platform
        }
    };
}



export function reducer(state = Immutable.fromJS({
    'list' : {},
}), action) {

    switch (action.type) {

       case BEFORE_LOAD_CLUB_SOCIAL_LIST:
            if (!state.getIn(['list',action.payload.key,'list'])) {
                state = state.setIn(['list',action.payload.key,'list'],Immutable.List([]));
            }
            return state
            .setIn(['list',action.payload.key,'is_fetching'],true)
            .setIn(['list',action.payload.key,'is_fetched'],false)

        case LOAD_CLUB_SOCIAL_LIST_SUCCESS:
            return state.setIn(['list',action.payload.key,'is_fetching'],false)
            .setIn(['list',action.payload.key,'is_fetched'],true)
            .setIn(['list',action.payload.key,'list'],Immutable.List(action.payload.response.result))

        case LOAD_CLUB_SOCIAL_LIST_FAILURE:
            return state.setIn(['list',action.payload.key,'is_fetching'],false)


        default:
            return state
    }
}


