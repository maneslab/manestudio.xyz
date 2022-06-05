import {mergeEntities} from 'redux/reducer.js'
import message from 'components/common/message'

import {UserException,UnloginException} from 'helper/exception'
// import {setLoginModal} from 'redux/reducer/setting'

function callapiMiddleware({ dispatch, getState }) {
    return function (next) {
        return function (action) {

            // console.log('debug03调用到',action)

            const {
                types,
                callAPI,
                dataSource,
                show_status,
                data_format,
                check_login,
                shouldCallAPI = () => true,
                payload = {},
                before_payload,
                throw_error,
            } = action;

            if (!types) {
                // 普通 action：传递
                return next(action);
            }

            //如果是一个需要登录的操作会先看用户是否登录了
            if (check_login) {
                var state = getState();
                if (!state.getIn(['setting','login_user'])) {

                    // console.log('debug03调用到action,因为用户未登录,所以这个消息将被拒绝');
                    message.error('用户未登录');
                    // dispatch(showLoginForm())
                    //返回一个空的promise对象
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                }
            }

            if (
                !Array.isArray(types) ||
                types.length !== 3 ||
                !types.every(type => typeof type === 'string')
            ) {
                throw new Error('Expected an array of three string types.');
            }

            if (typeof callAPI !== 'function') {
                throw new Error('Expected fetch to be a function.');
            }

            if (!shouldCallAPI(getState())) {
                console.log('not need catch by shouldCallAPI')
                return {};
            }

            if (before_payload) {
                var payload_data = before_payload(getState(),payload)
            }else {
                var payload_data = payload;
            }

            const [requestType, successType, failureType] = types;


            if (show_status.loading && typeof window !== 'undefined') {
                var hide = message.loading(show_status.loading, 0);
            }

            // dispatch(requestType(payload_data));

            dispatch({
                type: requestType,
                payload : payload_data
            });
            
            // console.log('debug02,action',action);

            return callAPI()
            .then(response => {
                console.log('debug02,response',typeof response,response);
                if (typeof response == 'object' && !response.json) {
                    return response
                }else {
                    return response.json()
                }
            })
            .then(json => {

                // console.log('debug02,进入正常流程',json);

                if (show_status.loading) {
                    hide();
                }
                
                if (dataSource == 'contract') {
                    
                }
                // 这里需要判断2重api的返回情况。
                // 对于数据的API，判断code == 0
                // 对于默认的API，判断status 是不是成功
                // console.log('result,middleware,json',json);
                if (json.status != 'success' && json.code != 0 && dataSource != 'contract') {
                    if (json.error_code) {
                        throw {
                            'message'     :    json.message,
                            'error_code'  :    json.error_code,
                            'data'        :    json
                        };
                    }else {
                        throw {
                            'message'     :    json.message,
                            'data'        :    json
                        };
                    }
                }else {
                    // console.log('debug:展示成功');
                    if (show_status.success && typeof window !== 'undefined') {
                        message.success(show_status.success)
                    }

                    if (data_format) {
                        var format_data = data_format(json)
                    }else {
                        var format_data = (json) ? json : {};
                    }

                    let payload = Object.assign({}, payload_data, {
                        response    : format_data
                    })


                    if (payload.response && payload.response.entities) {
                        dispatch(mergeEntities(payload.response.entities));
                    }

                    // dispatch(successType(payload));
                    // dispatch(Object.assign({}, payload_data, {
                    //     response    : format_data,
                    //     type        : successType
                    // }))


                    dispatch({
                        type    : successType,
                        payload : payload
                    });

                }


                return json;

            }).catch(function(e) {

                console.log('debug02,进入错误控制',show_status.error);
                console.log('debug02,errpr',typeof e,e.name,e.message);
                console.log('debug02,error-stack',e.stack);

                if (hide) {
                    hide();
                }

                if (show_status.error) {
                    if (e.message) {
                        showError(e.message);
                    }else if(e.messages) {
                        Object.keys(e.messages).map(one=>{
                            showError(e.messages[one]);
                        })
                    }else {
                        showError('unkown error');
                    }
                }

                let payload = Object.assign({}, payload_data, {
                    error    : e
                })

                dispatch({
                    type    : failureType,
                    payload : payload
                });

                if (throw_error) {
                    throw new Error(e.message);
                }

                return e;
            });
        };
    };
}

let showError = (error_message) => {
    if (typeof window !== 'undefined') {
        message.error(error_message)
    }
}

export default callapiMiddleware
