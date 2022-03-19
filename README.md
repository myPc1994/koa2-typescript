# 整体介绍
博客地址：[博客地址](https://blog.csdn.net/chen_p_cheng/article/details/120593443?spm=1001.2014.3001.5501)
项目地址：[项目地址](https://gitee.com/CPC1994/koa2-typescript-mongose)

> 开发框架：koa2

> 开发语言：Nodejs、TypeScript

> 数 据 库：Mongodb
>  数据库操作插件：mongose

> token生成与验证：jsonwebtoken

> 日志插件：
> 开发环境: 自定义拦截 控制台打印   
> 生产环境：自定义拦截配置设置，log4js、mongodb

> 日期格式化插件：moment

> 数据格式校验：Joi

> 二维码生成：svg-captcha

> 文件上传插件：koa-multer

> excel解析插件：node-xlsx

>API注释接口文档生成：apidoc 

> 语法格式检测：tslint

> 运行稳定性加持：pm2

> 源代码加密保护：javascript-obfuscator

## Build Setup

```bash
# 安装依赖关系
    npm install

# 开发环境运行+代码变动检测
    npm run dev
    
# 开发环境运行
    npm run start

# 构建生产环境包+代码不加密
    npm run build
# 构建API接口文档
    npm run apidoc
    
# 构建加密混淆包+代码加密
	npm run obfuscator
```
## 生成环境部署包
### 打包优势：允许对源代码加密混淆（javascript-obfuscator）
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
    |-- src  存放源代码文件夹
    |   |-- app.ts 源代码入口
    |   |-- GlobalVariable.ts 全局变量
    |   |-- core 核心文件
    |   |   |-- CpcInterface.ts 接口处理
    |   |-- db 数据处理层
    |   |   |-- BaseDb.ts  基础数据库处理
    |   |   |-- index.ts 数据库入口文件，包含连接数据库等操作
    |   |   |-- mongoseTest.md mongose一些使用的说明
    |   |   |-- controller 数据库业务操作逻辑
    |   |       |-- rbac 用户-角色-权限的rbac模式
    |   |           |-- AuthCtrl.ts  权限表
    |   |           |-- RoleAuthCtrl.ts  角色权限表
    |   |           |-- RoleCtrl.ts 角色表
    |   |           |-- UserCtrl.ts 用户表
    |   |           |-- UserRoleCtrl.ts 用户角色表
    |   |-- log 日志
    |   |   |-- ILogUtil.ts  日志接口
    |   |   |-- LogUtil.ts   对外统一出口
    |   |   |-- console   控制台输出-只有开发环境生效
    |   |   |   |-- LogConsole.ts
    |   |   |-- log4js    文件输出-只有生产环境生效
    |   |   |   |-- log4js.ts
    |   |   |   |-- Log4jsUtil.ts
    |   |   |-- logDB    数据库输出-只有生产环境生效
    |   |       |-- LogDB.ts
    |   |-- routes  路由
    |   |   |-- controller  逻辑层
    |   |   |   |-- IndexCtrl.ts
    |   |   |   |-- RbacCtrl.ts
    |   |   |   |-- UsersCtrl.ts
    |   |   |-- routers  对外接口
    |   |       |-- index.ts
    |   |       |-- rbac.ts
    |   |       |-- users.ts
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
    |       |-- CaptchaUtil.ts  验证码
    |       |-- CryptoUtil.ts 密码加盐处理
    |       |-- FileUtil.ts  文件处理
    |       |-- JoiUtil.ts  数据格式校验
    |-- static                           项目必备的静态文件
    |   |-- county.json
    |   |-- mobileApp.pdman.json         数据设计图，使用pdman设计的
    |-- public                           项目运行中生成的静态文件
  ```
  
  
## 其他说明
### 数据库的封装说明
 ```
       |   |-- db      model层
        |   |   |-- BaseDb.ts   数据库处理定义的基类
        |   |   |-- index.ts    mongose连接工具类
        |   |   |-- mongoseTest.md mongose使用样例
        |   |   |-- controller   数据库业务控制层
        |   |       |-- GeojsonCtrl.ts     geojson空间数据的操作类
        |   |       |-- rbac               rbac模式下，设计的权限，角色，用户
        |   |           |-- AuthCtrl.ts      权限表
        |   |           |-- RoleAuthCtrl.ts   角色权限关联表
        |   |           |-- RoleCtrl.ts       角色表
        |   |           |-- UserCtrl.ts       用户表
        |   |           |-- UserRoleCtrl.ts    用户角色表
```
1.在基类【BaseDb.ts 】中内置了常用的操作方法【增删改查，分页查询等基础功能】

2.在各自的业务中，自己在封装自己的业务逻辑，<br>
    a.例如【GeojsonCtrl.ts】定义了指定地理空间查询从最近到最远返回文档的点。使用球面几何计算距离 。<br>
    b.例如：【AuthCtrl.ts 】 定义了删除权限，需要同时删除角色权限关联表的信息。<br>
### 日志打印说明
    在环境变量配置文件中（/env目录）,根据需要配置对应的存储方案
    //日志配置：支持log4js文件记录，和数据库记录
     log:{
            type:"file",//file,db//文件保存，还是数据库保存
        }
    内部做了一整套的日志处理工具，具体请看：src/log 目录
    希望做日志的输出的话，不要在使用console.log();替换成LogUtil.log();
    例如：  logUtil.log(ELevel.info, '连接数据库成功:' + uri)
    定义了日志抽象类ILogUtil,所有不同场景（保存到文件，保存到mongodb，保存到MySQL等）的日志输出都必须继承它，方便日志维护和扩展
    开发环境: console目录，定义了开发环境中，直接在控制台输出，不做其他日志存储
    生产环境：log4js 文件方案存储（已完成） logDB（未完成）
    
###  路由设计方式，分为接入层（routes/routers）和业务控制层(routes/controller)
#### 接入层
1.注释使用apidoc格式注释，方便生成api文档

2.这里只做数据的接入和参数的校验
```typescript
    /**
     * @api {post} /rbac/user 创建用户
     * @apiGroup 用户操作
     * @apiParam {String} account 用户名
     * @apiParam {String} password 密码
     * @apiUse responseSuccess
     * @apiSuccess (200) {Object} data 数据
     * @apiSuccess (200) {String} data.userId 用户id
     * @apiSuccess (200) {String} data.account 账号
     * @apiSuccess (200) {String} data.createTime 创建时间
     * @apiVersion 1.0.0
     */
    router.post('/user', JoiUtil.middlewareByObject({
        account: Joi.string().alphanum().min(5).max(20).required(),
        password: Joi.string().alphanum().min(6).max(20).required()
    }), RbacCtrl.addUser);
```
#### 接入层
1.这里用户处理业务逻辑
```typescript
    // 创建用户
    public static async addUser(ctx: Context, next: Next) {
        const {account, password} = ctx.request.body;
        const data: IReturnInfo = await UserCtrl.addUser(account, password);
        ResponseBeautifier.response(ctx, data);
    }
```
### token的认证机制
代码目录:/utils/token/JwtUtil.js

> 封装了一个token认证的中间件

> 对jsonwebtoken做了一层处理,分别为生成token,校验token，校验token中间件

> 需要token校验的方法，直接使用token中间件即可，例如：

```
    // 需要验证的方法前，加入JwtUtil.middleware即可
 	router.post('/register', JoiUtil.middleware(UsersJoi.register), UsersCtrl.register);
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
```typescript
    export const ResponseInfo = {
    success: {code: 200, message: "成功!"},// 正常返回
    badRequest: {code: 400, message: "错误请求!"},// 表示其他错误，就是4xx都无法描述的错误
    parameterError: {code: 401, message: "参数错误!"},// 参数错误
    dataError: {code: 402, message: "数据错误!"},// 参数没有错误，但是数据内容不允许
    tokenError: {code: 403, message: "token错误或者过期!"},
    internalServerError: {code: 500, message: "系统内部错误!"},// 表示其他错误，就是5xx都无法描述的错误
}
```
> 示例
```typescript
    ResponseBeautifier.success(ctx, data, "token验证成功!");
    ResponseBeautifier.responseByStatus(ctx, ResponseInfo.success, "token验证成功!");
    ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "该用户名已存在!");
```
### 接口数据校验
具体查看：utils/JoiUtil.ts文件
> 对参数的校验做了中间件的封装

> 需要验证的方法前，加入JoiUtil.middleware即可
```typescript
	    // 创建角色
		router.post('/role', JoiUtil.middleware(RbacJoi.addRole), RbacCtrl.addRole);
		// 删除角色
		router.delete('/role', JoiUtil.middleware(RbacJoi.deleteRole), RbacCtrl.deleteRole);
		// 修改角色
		router.put('/role', JoiUtil.middleware(RbacJoi.putRole), RbacCtrl.putRole);
		// 查询角色信息
		router.get('/role', JoiUtil.middleware(RbacJoi.getRole), RbacCtrl.getRole);
```