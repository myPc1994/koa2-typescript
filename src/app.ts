import {GlobalVariable} from "./GlobalVariable";
import Koa from 'koa';
import Router from 'koa-router';
import koa_static from 'koa-static-server';
import koa_json from 'koa-json';
import koa_cors from 'koa2-cors';
import path from 'path';
import fs from 'fs';
import {logUtil} from "./log/LogUtil";

const koaBody = require('koa-body');
const app = new Koa();
app.use(koaBody());
app.use(logUtil.net());//日志处理
app.use(koa_cors());//跨域处理
app.use(koa_json());
app.use(koa_static({rootDir: 'public', rootPath: '/public'}));//服务器自带的数据
app.use(koa_static({rootDir: 'static', rootPath: '/static'}));//静态数据（代码生成，用于存放用户数据上传等）
// routes--动态引入
fs.readdirSync(path.resolve(__dirname, './routes')).forEach(file => {
    let route: Router = require(path.resolve(__dirname, `./routes/${file}`)).default;
    app.use(route.routes()).use(route.allowedMethods());
});
// error-handling
app.on('error', async (error, ctx) => {
    //正式环境的错误，已经被记录了，这里不再处理
    if (GlobalVariable.isDev) {
        if (error.status !== 404) {
            console.error('服务器发生错误了', error);
        }
    }
});
module.exports = app;