'use strict';
/**
 * 生产环境配置文件
 */
module.exports = {
    env: 'production', //环境名称
    agreement: "http",
    port: "9999",
    log:{
        type:"file",//file,db//文件保存，还是数据库保存
    },//日志配置：支持log4js文件记录，和数据库记录
};

