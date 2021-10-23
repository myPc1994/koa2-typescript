import {GlobalVariable} from "./GlobalVariable";
import Koa from 'koa';
import Router from 'koa-router';
import koa_static from 'koa-static-server';
import koa_json from 'koa-json';
import koa_cors from 'koa2-cors';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import {logUtil} from "./log/LogUtil";
import {Pm2FlushTool} from "./tools/Pm2FlushTool";

const app = new Koa();

app.use(koa_cors());// 跨域处理
app.use(koa_static({rootDir: 'public', rootPath: '/public'}));// 静态数据（代码生成，用于存放用户数据上传等）
app.use(koa_static({rootDir: 'static', rootPath: '/static'}));// 服务器自带的数据,同步到git上
app.use(bodyParser());// get,post参数解析
app.use(koa_json());
app.use(logUtil.net());// 日志处理
// routes--动态引入
fs.readdirSync(path.resolve(__dirname, './routes')).forEach(file => {
    let route: Router = require(path.resolve(__dirname, `./routes/${file}`)).default;
    app.use(route.routes()).use(route.allowedMethods());
});
// error-handling 已经在/log/ILogTool拦截统一处理了
// app.on('error', async (error, ctx) => {
//
// });
Pm2FlushTool.start();
module.exports = app;