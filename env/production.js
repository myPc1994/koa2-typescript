'use strict';
/**
 * 生产环境配置文件
 */
module.exports = {
  env: 'production', //环境名称
  agreement: "http",
  port: "9999",
  log: {
    type: "file",//file,db//文件保存，还是数据库保存
  },
  mongodb_config: { //mongodb数据库配置
    user: "cpc",
    pass: "admin",
    host: "127.0.0.1",
    port: 27017,
    database: "mobileApp",
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
};
