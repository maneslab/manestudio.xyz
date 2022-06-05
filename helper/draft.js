
import {getConfig} from 'helper/config'

export function getContentObject(content) {
    try {
        var json_data = JSON.parse(content)
    }catch(error) {
　　     var json_data = null;
　　 }
    if (json_data) {
        //这是一个object的对象，draft的数据
        return json_data;
    }else {
        //这是一个不是object的对象，html的数据
        return false;
    }
}

export function isDraft(content) {
    try {
        var json_data = JSON.parse(content)
    }catch(error) {
　　     var json_data = null;
　　 }
    if (json_data) {
        //这是一个object的对象，draft的数据
        return true;
    }else {
        //这是一个不是object的对象，html的数据
        return false;
    }
}

export function getPhoto(json_data) {

    if (typeof(json_data) == 'string') {
        json_data = getContentObject(json_data)
    }
    try {
        for(var p in json_data['blocks']){  
            if (json_data['blocks'][p]['type'] == 'atomic:image') {
                return json_data['blocks'][p]['data']['url'];
            }
        }
        return false;
    }catch(error) {
        console.log('err',error)
        return false;
    }
}

export function getText(json_data) {
    if (typeof(json_data) == 'string') {
        json_data = getContentObject(json_data)
    }

            console.log('json_data',json_data)
    var text = '';
    try {
        for(var p in json_data['blocks']){  
            if (json_data['blocks'][p]['text'] != undefined) {
                text += json_data['blocks'][p]['text'].trim()
            }
        } 
        return text
    }catch(error) {
        console.log('err',error)
        return text
    }
}

export function getAudio(json_data) {
    if (typeof(json_data) == 'string') {
        json_data = getContentObject(json_data)
    }
    try {
        var photo = false;
        for(var p in json_data['entityMap']){  
            if (json_data['entityMap'][p]['type'] == 'audio') {
                if (!photo) {
                    photo = json_data['entityMap'][p]['data']['src'];
                }
            }
        }
        return photo
    }catch(error) {
        console.log('err',error)
        return false;
    }
}

export function isDraftEmpty(json_data) {
    if (typeof(json_data) == 'string') {
        json_data = getContentObject(json_data)
    }
    if (!json_data) {
        return false;
    }
    let text = getText(json_data)
    let photo = getPhoto(json_data)
    let audio = getAudio(json_data)
    if (!text && !photo && !audio) {
        return true
    }else {
        return false;
    }
}

export function getSummary(data) {
    var summary = {
        'text'  : '',
        'photo' : ''
    }
    if (data) {
        summary['photo'] = getPhoto(data);
        summary['text']  = getText(data);
    }
    return summary
}

export function getSummaryByDraft(json_data) {
    if (typeof(json_data) == 'string') {
        json_data = getContentObject(json_data)
    }

    var summary = {
        'text'  : '',
        'photo' : ''
    }
    if (json_data) {
        summary['photo'] = getPhoto(json_data);
        summary['text']  = getText(json_data);
    }
    return summary
}


export function getEditorConfig() {

    let config = getConfig('EDITOR')

    return {
        'base'   :  {
            'img_base_url'  :  config.icon_image_url+'/img/editor'
        },
        'unsplash' : {
            'api'           :  config.api_url+'/v1/unsplash/list',
            'active'        :  true,
            'with_jwt_token':  true,
            'data_format'   :  (data) => {
                console.log('debug001,获得数据是',data)
                if (data.status == 'success') {
                    return {
                        'list'          : data.data.results,
                        'list_count'    : (data.total) ? data.total : 0
                    }
                }else {
                    message.error(data.message)
                }
            },
        },
        'image_upload' : {
            'api'           : config.api_url+'/v1/upload/img?template=post_image',
            'data_format'   : (data) => {
                return data.data.image_urls.url
            },
            'error_message' : (data) => {
                return data.message
            }
        },
        // 'audio_upload' : {
        //     'api'           : 'http://dev.api.tinyclub.com/v1/upload/file?type=audio',
        //     'data_format'   : (data) => {
        //         return data.data.original_file_url
        //     },
        //     'error_message' : (data) => {
        //         if (typeof data == 'object' && data.message) {
        //             return data.message
        //         }else {
        //             return 'unknow network error';
        //         }
        //     }
        // },
        'bookmark'  : {
            'api'           :  config.api_url+'/v1/bookmark/get',
            'data_format'   : (data) => {
                return data;
            },
            'error_message' : (data) => {
                if (typeof data == 'object' && data.message) {
                    return data.message
                }else {
                    return 'unknow network error';
                }
            }
        },
    }

}
