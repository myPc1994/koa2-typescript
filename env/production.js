'use strict';
/**
 * 生产环境配置文件
 */
module.exports= {
    env: 'production', //环境名称
    agreement: "http",
    port: "9999",
    mongodb_config: { //mongodb数据库配置
        user: "",
        pass: "",
        host: "127.0.0.1",
        port: 27017,
        database: "cloudRender",
        option: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
};
