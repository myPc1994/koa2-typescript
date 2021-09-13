'use strict';
const development = require('./development');//开发环境 可查看"EnvConfig"的定义说明   位于src/core/CpcInterface.ts
const production = require('./production');//生产环境   可查看"EnvConfig"的定义说明   位于src/core/CpcInterface.ts
const envConfigList = [development, production];
const node_env = process.env.NODE_ENV.replace(/(^\s*)|(\s*$)/g, "");
let config = production;
for (const envConfig of envConfigList) {
    if (envConfig.env === node_env) {
        config = envConfig;
        break;
    }
}
module.exports = config;