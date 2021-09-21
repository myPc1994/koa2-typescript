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
    user: "root",
    pass: "123456",
    host: "cpc_db",// mongodb容器的别名
    port: 27017,
    database: "test",
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
};
