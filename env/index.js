/* eslint-disable */
'use strict';
const development = require('./development');//开发环境 可查看"EnvConfig"的定义说明   位于src/core/CpcInterface.ts
const production = require('./production');//生产环境   可查看"EnvConfig"的定义说明   位于src/core/CpcInterface.ts
const envConfigList = [development, production];
let config = production;
if( process.env.NODE_ENV){
    const node_env = process.env.NODE_ENV.replace(/(^\s*)|(\s*$)/g, "");
    for (const envConfig of envConfigList) {
        if (envConfig.env === node_env) {
            config = envConfig;
            break;
        }
    }
}

module.exports = config;
