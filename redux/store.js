import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import callapiMiddleware from 'redux/middleware/callapi.js'
import {HYDRATE} from 'next-redux-wrapper';

import {createLogger} from 'redux-logger'
import {createWrapper} from 'next-redux-wrapper';
import Immutable from 'immutable';
import {getConfig} from 'helper/config'

import reducer from './reducer.js';

function createMiddlewares () { // { isServer }
    let middlewares = [
        thunkMiddleware,
        callapiMiddleware,
    ]
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        middlewares.push(createLogger({
            level: 'info',
            collapsed: true,
            stateTransformer: state => state.toJS(),
        }))
    }
    return middlewares
}

export const initStore = (initialState = {}, context) => {
    // const { isServer } = context
    const middlewares = createMiddlewares()

    // console.log('debug008,initStore');

    // if (typeof window !== 'undefined') {
      // console.log('debug008,window[__NEXT_REDUX_STORE__]',window,initialState)
    // }

    let store =  createStore(
        reducer,
        Immutable.fromJS(initialState),
        compose(
          applyMiddleware(...middlewares),
          typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    )
    
    // store.subscribe(() => {
    //     if (typeof window !== 'undefined') {
    //         let data_api_url = store.getState().getIn(['setting','data_api_url'])  //这就是你获取到的数据state tree，由于使用了subscribe，当数据更改时会重新获取
    //         if (getDataApiUrl() != data_api_url) {
    //             setDataApiUrl(data_api_url);
    //         }else {
    //             console.log('window.dexduck_data_api_url',getDataApiUrl());
    //         }
    //     }
    // });


    ///初始化

    return store;
}

// create a makeStore function
export const makeStore = context => initStore();


// export an assembled wrapper
// export const wrapper = createWrapper(makeStore, {debug: true});
export const wrapper = createWrapper(makeStore
    , {
        debug: getConfig("DEBUG") ,
        serializeState: state => state.toJS(),
        deserializeState: state => Immutable.fromJS(state),
    }
);

