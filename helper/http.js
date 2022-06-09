import { getJwtToken } from 'helper/cookie'
import queryString from 'query-string'
import {urlStringify} from 'helper/common'
import message from 'components/common/message'
import {UnloginException} from 'helper/exception'

import config from 'helper/config';


let api_url_base = config.get('API');

function catchApiError(result) {
    let msg_type = typeof result.message;

    if (msg_type == 'string') {
        message.error(result.message);
    }else if (msg_type == 'object') {
        Object.keys(result.message).map(one=>{
            message.error(result.message[one]);
        })
    }
}


function getApiUrl(url) {
    if (url.indexOf('/') == 0) {
        // console.log('publicRuntimeConfig',publicRuntimeConfig);
        return config.get('API') + url;
    }else {
        return url;
    }
}

/**
 * @function 参数拼接
 * @param {object} obj 只支持非嵌套的对象
 * @returns {string}
 */
function params(obj) {
  let result = '';
  let item;
  for (item in obj) {
    if (obj[item] && String(obj[item])) {
      result += `&${item}=${obj[item]}`;
    }
  }
  if (result) {
    result = '?' + result.slice(1);
  }
  return result;
}

function uploadRequest(upload_config) {

    var header = {
      'Authorization'  : getJwtToken()
    }

    if (upload_config.action.indexOf('/') == 0) {
       upload_config.action = publicRuntimeConfig['env']['API']+upload_config.action;
    }

    const upload_props = {
        name: 'file',
        credentials : 'same-origin',
        mode: 'cors',
        headers: header,
        showUploadList : true,
        multiple: true,
    };

    return Object.assign(upload_props,upload_config)
}

      
const dealHttpResponse = (response) => {

    switch(response.status) {
        case 401:
            throw new UnloginException();
            break;

        case 400:
        case 422:
            // console.log('response/json',response.json().then(data=>{

            // }))
            // throw Error('请求参数不正确');
            return response.json()
            break;

        case 200:
            return response.json()
            break;

        case 500:
            throw Error('servers response error');
            break;

    }

}


export const httpRequest = function (input_data)
{

    const def = {
        'method'        : 'GET',
        'with_jwt_token': true,
        'data'          : {},
        'api_type'      : null
    }

    const conf = Object.assign(def,input_data);

    const {data,method,with_header,with_jwt_token,api_type} = conf;

    let url = getApiUrl(conf.url)

    var fetch_options = {
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, same-origin, *omit
        credentials : 'same-origin',
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
    }

    if (with_jwt_token) {
        fetch_options['headers'] = {
          'Authorization'  : getJwtToken()
        }
    }

    switch(method) {
        case 'POST':
            var form = new FormData();
            for (var i in data) {
                form.append(i, data[i])
            } 
            fetch_options['body'] = form;
            break;
        case 'GET':
            url = urlStringify(data,url)
            break;
        case 'DELETE':
        case 'PATCH':
            fetch_options['body'] = queryString.stringify(data);
            fetch_options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
            break;
    }


    return fetch(url,fetch_options).then(response => {
        return dealHttpResponse(response);
    }).then(json_data => {

        // console.log('debug02,获得json的数据',json_data)
        // console.log('debug02,getConfig',getConfig('env'))

        // if (getConfig('env') == 'local') {
        //     console.log('请求URL和结果',url,json_data);
        // }

        if (json_data.code && json_data.code != 200) {
            // console.log('json_data',json_data);
            // console.log('json_data.messages',json_data.messages);
            // console.log('json_data.messages.join',json_data.messages.join(','));
            throw json_data;
            
            // if (json_data.messages) {
            //     throw Error('error : '+json_data.messages.join(','));
            // }else if(json_data.message){
            //     throw Error('error : '+json_data.message);
            // }else {
            //     throw Error('unkown errors');
            // }
        }


        // console.log('errr');
        return json_data
    }).catch(e=>{
        // console.log('debug02,HTTP request捕获错误',e)
        if (e.name == 'UnloginException') {
            // console.log('debug02,捕获未登录错误',e)
            throw e;
        }else {
            throw e;
        }
    })
}



module.exports = {
    httpRequest         : httpRequest,
    // fetchGetPromise     : fetchGetPromise,
    // httpRequestAwait    : httpRequestAwait,
    uploadRequest       : uploadRequest,
    catchApiError       : catchApiError
}
