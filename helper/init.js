import {getConfig} from 'helper/config'
import {httpRequestAwait} from 'helper/http'
import {removeValueEmpty} from 'helper/common';
// import {formatPairList} from 'helper/dataapi'

import { normalize } from 'normalizr';
import { userSchema} from 'redux/schema/index';

import {mergeEntities} from 'redux/reducer.js'
import {initLoginUser} from 'redux/reducer/setting'
//setDataApiUrl
// import {formatDataApiUrl,formatApiUrl} from 'helper/dataapi'

export const initPage = async (pagename,data,dispatch = null,cookies = null) => {

    // console.log('debug008,准备开始init_page',pagename,data);
    
    let data_api = null;
    let url_base = getConfig('API');

    switch(pagename) {
        case 'login_user':
            data_api = url_base + '/v1/init/login_user';
            break;

        default:
            console.log('not init api');
            return;
    }

    let result = null;
    try {
        result = await httpRequestAwait({
            'method'        : 'GET',
            'jwt_token'     : cookies.jwt_token ? cookies.jwt_token : null,
            'url'           : data_api,
            'data'          : removeValueEmpty(data)
        })
    }catch(e) {
        console.log('报错了',e);
        return null;
    }


    // console.log('debug008,请求init结果是',result);

    if (result && (result.code == 0 || result.status == 'success')) {
        
        switch(pagename) {

            case 'index':
                break;

            case 'login_user':
                if (result.data.login_user) {
                    var output = normalize(result.data.login_user, userSchema)
                    dispatch(mergeEntities(output.entities));
                    dispatch(initLoginUser(output))
                }
                break;


            default:
                break;
        }

    }

    return result;

}
