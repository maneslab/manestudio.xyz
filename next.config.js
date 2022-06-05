
const path = require('path');
const nextTranslate = require('next-translate')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

console.log('当前运行的环境',process.env.ENV)

let getConfig = (env) => {
    let c2;
    switch(env) {
        case 'dev':
            c2 = require('./config/dev.js');
            break;
        case 'production':
            c2 = require('./config/production.js');
            break;
        default:
            c2 = {}
    }
    return c2;
}

let getGlobalConfig = (env) => {
    let basic_config;
    switch(env) {
        case 'dev':
            basic_config = require('./config/dev.js');
            break;
        case 'production':
            basic_config = require('./config/production.js');
            break;
        default:
            console.log('运行到不能理解的环境',env,site_name);
            break;
    }

    let site_config = getConfig(env);

    let env_config = Object.assign(basic_config,site_config);

    return {
        'publicRuntimeConfig'  : {
            'env' : env_config
        }
    }
}

let global_config = getGlobalConfig(process.env.ENV);


let config = {
    reactStrictMode: true,
    
    webpack(config, { webpack, isServer, dev }) {

      config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
      });

      config.module.rules.push({
          test: /\.md$/,
          use: ["raw-loader"]
      });


      console.log('alias',path.resolve(process.cwd(), 'node_modules', 'bn.js'));

      config.resolve.alias = {
        ...config.resolve.alias,
        'bn.js': path.resolve(process.cwd(), 'node_modules', 'bn.js'),
      };

      // if (!isServer) {
      //       config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
      // }

      if (!isServer) {
        config.resolve.fallback.fs = false;
      }
  

      return config;
    }
}

module.exports = withBundleAnalyzer(
    nextTranslate(Object.assign(config,global_config))
)