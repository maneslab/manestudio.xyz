module.exports = function(api) {

    let env = api.cache(() => process.env.NODE_ENV);
    let config_env = api.cache(() => process.env.NEXT_PUBLIC_ENV);

    let plugins = [
        'inline-json-import',
        "react-html-attrs",
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-function-bind'],
    ]    

    if (config_env == 'production') {
        plugins.push('transform-remove-console');
    }

    console.log('babel-config-env',config_env,env);

    return {
        presets : [
            "next/babel"
        ],
        plugins : plugins,
    }
}

