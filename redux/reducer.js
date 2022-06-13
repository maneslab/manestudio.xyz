import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";
import { combineReducers } from 'redux-immutable';
import {mergeDeepOverwriteLists} from 'helper/immutable';

import { reducer as setting } from './reducer/setting.js'
import { reducer as user } from './reducer/user.js'
import { reducer as club } from './reducer/club.js'
import { reducer as roadmap } from './reducer/roadmap.js'
import { reducer as gallery } from './reducer/gallery.js'
import { reducer as creator } from './reducer/creator.js'

import {createAction} from 'helper/common'

export const MERGE_ENTITES = 'MERGE_ENTITES';
export const mergeEntities = createAction('MERGE_ENTITES');


function entities(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        case MERGE_ENTITES:
            return mergeDeepOverwriteLists(state,Immutable.fromJS(action.payload))

        default:
            return state;
    }
}

// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         case HYDRATE:
//             return {...state, ...action.payload};
//         case 'TICK':
//             return {...state, tick: action.payload};
//         default:
//             return state;
//     }
// };

// // export default reducer

const allReducer = combineReducers({
    entities,
    setting,
    user,
    club,
    roadmap,
    gallery,
    creator
})

function crossSliceReducer(state, action) {

    switch (action.type) {
        case HYDRATE: 
            // console.log('debughy:本地数据',state.toJS())
            // console.log('debughy:准备合并服务器数据',action.payload.toJS())
            // console.log('debughy:对比数据是否一致',state.equals(action.payload))
            // console.log('debughy:合并结果',mergeDeepOverwriteLists(state,action.payload).toJS())
            return mergeDeepOverwriteLists(state,action.payload)
            // 根据观察，hydrate每次获得的数据都是某个时刻（前一页或者是初始化）的数据。
            // 对于比如已经init以后的再执行hydrate的时候会导致数据无法正常显示，甚至永远无法加载的bug，这里这个逻辑非常有问题，感觉是nextjs的坑
            // return state;
            
        default:
            return state
    }
}

function rootReducer(state, action) {
  const intermediateState = allReducer(state, action)
  const finalState = crossSliceReducer(intermediateState, action)
  return finalState
}

export default rootReducer