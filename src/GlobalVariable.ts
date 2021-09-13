import {DbUtil} from "./db";

const _global: any = global;
export const GlobalVariable = {
    envConfig: _global._envConfig,// 环境配置
    isDev: _global._envConfig.env === 'development',// 是否是开发者环境
    dbUtil: new DbUtil(_global._envConfig.mongodb_config)
}
