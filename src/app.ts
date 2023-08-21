import Koa from 'koa';
import Router from 'koa-router';
import koa_static from 'koa-static-server';
import koa_json from 'koa-json';
import koa_cors from 'koa2-cors';
import path from 'path';
import fs from 'fs';
import bodyParser from 'koa-bodyparser';
import koa_logger from 'koa-logger';
const app = new Koa();
app.use(koa_cors());// 跨域处理
app.use(koa_static({rootDir: 'public', rootPath: '/public'}));// 静态数据（代码生成，用于存放用户数据上传等）
app.use(koa_static({rootDir: 'static', rootPath: '/static'}));// 服务器自带的数据,同步到git上
app.use(koa_logger());// 日志处理
app.use(bodyParser());// get,post参数解析
app.use(koa_json());
// routes--动态引入
fs.readdirSync(path.resolve(__dirname, './routes/routers')).forEach(file => {
    const route: Router = require(path.resolve(__dirname, `./routes/routers/${file}`)).default;
    app.use(route.routes()).use(route.allowedMethods());
});
module.exports = app;
