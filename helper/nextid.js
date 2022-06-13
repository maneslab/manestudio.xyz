import config from 'helper/config';

export default class NextId {

    constructor() {
        let env = config.get('NEXTID_ENV')
        if (env == 'production') {
            this.setProduction();
        }else {
            this.setStaging();
        }
    }

    setProduction() {
        console.log('nextid:now-use-production env')
        this.url_base = 'https://proof-service.next.id';
    }

    setStaging() {
        console.log('nextid:now-use-staging env')
        this.url_base = 'https://proof-service.nextnext.id	';
    }

    getUrl(url) {
        return this.url_base + url;
    }

    async request(extra_url,request_data = {},method = 'GET') {
        let url = this.getUrl(extra_url);
        
        let params = {
            method : method,
            headers : {
                'Content-Type': 'application/json'
            },
        }

        if (method != 'GET') {
            params['body'] = JSON.stringify(request_data)
        }

        const response = await fetch(url,params)

        console.log('debug:response',response)
        if (!response.ok) {
            let response_text = await response.text();
            let response_json = JSON.parse(response_text);
            throw Error(response_json.message);
        }
        return response.json();
    }

    async healthz() {
        return await this.request('/healthz');
    }

    async proof_payload(cond) {
        return await this.request('/v1/proof/payload',{
            'action'        : cond.action,
            'platform'      : cond.platform,
            'identity'      : cond.identity,
            'public_key'    : cond.public_key ? cond.public_key : ''
        },'POST')
    }

    async proof_create(cond) {
        console.log('proof_create->data',cond);
        let request_data = {
            'action'        : 'create',
            'platform'      : cond.platform,
            'identity'      : cond.identity,
            'public_key'    : cond.public_key ? cond.public_key : '',
            'uuid'          : cond.uuid,
            'created_at'    : cond.created_at
        }

        if (cond.proof_location) {
            request_data['proof_location'] = cond.proof_location
        }

        if (cond.extra) {
            request_data['extra'] = cond.extra
        }

        return await this.request('/v1/proof',request_data,'POST')
    }

    async proof_delete(cond) {
        console.log('proof_delete->data',cond);
        let request_data = {
            'action'        : 'delete',
            'platform'      : cond.platform,
            'identity'      : cond.identity,
            'public_key'    : cond.public_key ? cond.public_key : '',
            'uuid'          : cond.uuid,
            'created_at'    : cond.created_at
        }

        if (cond.proof_location) {
            request_data['proof_location'] = cond.proof_location
        }

        if (cond.extra) {
            request_data['extra'] = cond.extra
        }

        return await this.request('/v1/proof',request_data,'POST')
    }
}