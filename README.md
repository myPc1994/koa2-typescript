# koa2+typeScript+mongose

> 开发框架：koa2

> 开发语言：TypeScript

> 数 据 库：Mongodb

> 权限验证：jsonwebtoken

> 数据库插件：mongose

> 日志插件：开发环境: koa-logger    生产环境：log4js、mongodb

> 日期格式化插件：moment

> 文件上传插件：koa-multer

> excel解析插件：node-xlsx

## Build Setup

``` bash
# 安装依赖关系
    npm install

# 开发环境运行
    npm run dev

# 构建生产环境包
    npm run build

# 构建接口文档
    npm run apidoc
# 
```
## 生成环境部署包
### windows系统部署
```
    1. npm run build 后生成dist文件夹
    2.拷贝dist文件夹所有内容到windows服务器上
    3.项目根目录下运行 npm install
    4.如果没有安装pm2,安装一下  npm install pm2 -g
    5.pm2方式启动，在根目录下运行 npm run start
```
### docker环境部署---docker-compose
```
    1.npm run build 后生成dist文件夹
    2.拷贝dist文件夹所有内容到linux服务器上
    3.已经配置了docker的服务编排工具，docker-compose
    4.根目录下运行 docker-compose up -d 即可
```
## 项目结构说明
  ```
 |-- node
     |-- .dockerignore  构建docker容器时，忽略项的配置
     |-- .gitignore     git忽略项配置
     |-- apidoc.js      apidoc生成
     |-- docker-compose.yml   docker容器编排
     |-- Dockerfile     docker容器生成规则
     |-- nodemon.json   nodemon配置
     |-- package.json   
     |-- pm2.config.js  pm2配置
     |-- printDir.js    打印输出目录
     |-- README.md      描述的md文件
     |-- tsconfig.json  typeScript配置
     |-- tslint.json    tslint配置
     |-- bin            
     |   |-- www        项目开始执行的入口文件
     |-- build          存放构建相关文件夹
     |   |-- end.js     构建结束后执行
     |   |-- start.js   构建开始前执行
     |   |-- util       存放工具类
     |       |-- fileUtil.js  文件处理工具类
     |-- env             存放环境配置
     |   |-- development.js    开发环境
     |   |-- index.js          环境的统一出口
     |   |-- production.js     生产环境
     |-- logs           存放日志文件夹
     |   |-- net        存放网络相关的日志
     |   |   |-- netError.2021-09-19.log    请求错误
     |   |   |-- netResponse.2021-09-19.log  请求成功
     |   |-- system     存放系统相关的日志
     |       |-- systemInfo.2021-09-19.log
     |-- src            存放源代码文件夹
     |   |-- app.ts     源代码入口
     |   |-- GlobalVariable.ts   全局变量
     |   |-- core       核心文件
     |   |   |-- CpcInterface.ts  接口处理
     |   |-- db         数据处理层
     |   |   |-- BaseDb.ts   基础数据库处理
     |   |   |-- index.ts    数据库入口文件，包含连接数据库等操作
     |   |   |-- mongoseTest.md   mongose一些使用的说明
     |   |   |-- tables.ts    数据库所有的表格
     |   |   |-- controller   业务操作逻辑
     |   |       |-- UserCtrl.ts   
     |   |       |-- VersionUpgradeCtrl.ts
     |   |-- log        日志
     |   |   |-- ILogUtil.ts   日志接口
     |   |   |-- LogUtil.ts    对外统一出口
     |   |   |-- console       控制台输出-只有开发环境生效
     |   |   |   |-- LogConsole.ts
     |   |   |-- log4js        文件输出-只有生产环境生效
     |   |   |   |-- log4js.ts
     |   |   |   |-- Log4jsUtil.ts
     |   |   |-- logDB         数据库输出-只有生产环境生效
     |   |       |-- LogDB.ts
     |   |-- routes            路由
     |   |   |-- index.ts
     |   |   |-- users.ts
     |   |-- utils             工具类
     |       |-- Excel2dbFormatUtil.ts   excel转为数据库支持的格式
     |       |-- FileUtil.ts             文件处理工具类
     |       |-- JsUtil.ts               js工具类
     |       |-- MulterUtil.ts           文件上传工具类  
     |       |-- NetUtil.ts              网络处理工具类
     |       |-- Pm2FlushUtil.ts         pm2处理工具类
     |       |-- ResponseBeautifier.ts   统一返回格式
     |       |-- token                   token处理
     |           |-- JwtUtil.ts          jwt工具类
     |           |-- pem                 公钥和私钥
     |               |-- private_key.pem  私钥
     |               |-- public_key.pem   公钥
     |-- static                           项目必备的静态文件
     |   |-- county.json
     |   |-- mobileApp.pdman.json         数据设计图，使用pdman设计的
     |-- public                           项目运行中生成的静态文件
  ```
  
  
## 其他说明

### 日志打印说明
    内部做了一整套的日志处理工具，具体请看：src/log
    希望做日志的输出的话，不要在使用console.log();替换成LogUtil.log();
    例如：  logUtil.log(ELevel.info, '连接数据库成功:' + uri)
### token的认证机制
代码目录:/utils/token/JwtUtil.js
> 对jsonwebtoken做了一层处理,分别为生成token,校验token，校验token中间件

> 需要token校验的方法，直接使用token中间件即可，例如：

```
    // 需要验证的方法前，加入JwtUtil.middleware即可
    usersRouter.get('/verifyToken', JwtUtil.middleware, async (ctx: Context, next: Next) => {
        // TODO 检验通过后，处理对应的业务逻辑
        ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
    })
```

到目录/utils/token/pem/目录下，打开终端，使用openssl命令生成公钥私钥
    ```sudo
        //生成1024位的RSA私钥
        openssl genrsa -out private_key.pem 1024
        
        //再由私钥生成公钥
        openssl rsa -in private.pem -pubout -out public_key.pem
        
        //私钥文件private.pem
        //公钥文件public.pem
        //上面私钥是没加密的，可选加密，指定一个加密算法生成时输入密码
        
        //查看密钥
        openssl rsa -noout -text -in private.pem
        //私钥文件中也包含公钥信息
### 统一返回格式---ResponseBeautifier
具体查看：utils/ResponseBeautifier.ts文件
> 示例
```typescript
    ResponseBeautifier.success(ctx, null, "入库成功");
    ResponseBeautifier.fail(ctx, EResponseType.parameterError, "缺少参数file");
```