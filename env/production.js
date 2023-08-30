/* eslint-disable */
'use strict';
/**
 * 生产环境配置文件
 */
module.exports = {
    env: 'production', //环境名称
    agreement: "http",
    port: "9999",
    db:{
        path:"db/database.db",
        options:{}
    },
};

