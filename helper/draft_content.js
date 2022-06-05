
import {httpRequest} from 'helper/http'
import {getHashByData} from 'helper/common'

export function saveDraft(key_map,draft_content,options = {}) {
    let hash = getHashByData(key_map);

    if (typeof options.before == 'function') {
        options.before();
    }

    return httpRequest({
        'url'      : '/v1/draft/add',
        'method'   : 'POST',
        'data'     : {
            key     : hash,
            content : draft_content
        }
    }).then(data=>{

        if (typeof options.after == 'function') {
            options.after(data);
        }
    
    }).catch(error=>{

        if (typeof options.after == 'function') {
            options.after(null);
        }

    })
} 

export function loadDraft(key_map,options = {}) {
    let hash = getHashByData(key_map);

    if (typeof options.before == 'function') {
        options.before();
    }

    return httpRequest({
        'url'      : '/v1/draft/load',
        'method'   : 'GET',
        'data'     : {
            key     : hash,
        }
    }).then(data=>{

        if (typeof options.after == 'function') {
            options.after();
        }

        if (typeof options.callback == 'function') {
            options.callback(data);
        }
        
    }).catch(error=>{

        if (typeof options.after == 'function') {
            options.after();
        }
        
    })
} 


