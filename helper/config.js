import default_config from '../config/default.json';
import develop_config from '../config/develop.json';
import production_config from '../config/production.json';
import staging_config from '../config/staging.json';


class Config {

    constructor() {
        this.cfg = this.loadConfig(process.env.NEXT_PUBLIC_ENV);
    }

    loadConfig(env) {
        let cfg = {};

        switch(env) {
            case 'production':
                cfg = Object.assign(default_config,production_config);
                break;
    
            case 'staging':
                cfg = Object.assign(default_config,staging_config);
                break;
    
            default:
                cfg = Object.assign(default_config,develop_config);
                break;
        }

        return cfg;
    }
    
    getValue(object, property) {
        let elems = Array.isArray(property) ? property : property.split('.'),
            name = elems[0],
            value = object[name];

            console.log('elems',elems);
            console.log('name',name);
            console.log('object',object);
            console.log('value',value);

        if (elems.length <= 1) {
          return value;
        }
        // Note that typeof null === 'object'
        if (value === null || typeof value !== 'object') {
          return undefined;
        }
        return this.getValue(value, elems.slice(1));
    }
    
    get(property) {
        
        if(property === null || property === undefined){
            throw new Error("Calling config.get with null or undefined argument");
        }

        console.group('config-get-value');
        console.log('this.cfg',this.cfg);
        console.log('property',property);

        let value = this.getValue(this.cfg, property);

        console.log('value',value);
        console.groupEnd();

        if (value === undefined) {
            throw new Error('Configuration property "' + property + '" is not defined');
        }
    
        // Return the value
        return value;
    }

    has(property) {
       
        if(property === null || property === undefined){
            throw new Error("Calling config.get with null or undefined argument");
        }
    
    
        return (this.getValue(this.cfg, property) !== undefined);
    }
}
  
let config = new Config();

export default config;