'use strict';
/**
 * 开发环境配置文件
 */
module.exports = {
    env: 'development', //环境名称
    agreement: "http",
    port: "9990",
    log:{
        type:"file",//file,db//文件保存，还是数据库保存
    },//日志配置：支持log4js文件记录，和数据库记录
    mongodb_config: { //mongodb数据库配置
        user: "",
        pass: "",
        host: "127.0.0.1",
        port: 27017,
        database: "mobileApp_dev",
        option: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};
