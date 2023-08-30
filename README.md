# 整体介绍
博客地址：[博客地址](https://blog.csdn.net/chen_p_cheng/article/details/120593443?spm=1001.2014.3001.5501)
项目地址：[项目地址](https://gitee.com/CPC1994/koa2-typescript-mongose)

# TODO 修改中，暂时不要使用

> 开发框架：koa2

> 开发语言：Nodejs、TypeScript

> 数 据 库：Sqlite3 (选择原因：1、安装简单；2、占用小；)

>  数据库操作插件：better-sqlite3

> token生成与验证：jsonwebtoken

> 日志插件：无（直接console.log,console.error即可）   
> 开发环境: 控制台打印   
> 生产环境：pm2自动记录日志，并放在./logs/目录下   

> 日期格式化插件：dayjs

> 数据格式校验：Joi

> 二维码生成：svg-captcha

> 作业调度：node-schedule

>API注释接口文档生成：apidoc 

> 语法格式检测：eslint

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
	
# 代码格式化
	npm run eslint:fix
```
## 生成环境部署包
### 打包优势：允许对源代码加密混淆（防止源码泄露）
### windows系统部署
```
    1.运行npm run build或者npm run obfuscator(加密打包) 会把所有的文件构建到dist文件夹中
    2.拷贝dist文件夹所有内容到windows服务器上
    3.项目根目录下运行 npm install
    4.安装完成后，在根目录下运行 npm run init 设置pm2的相关参数设置（例如日志分割，分割大小等等）
    5.初始化完成后，运行 npm run start 或者 双击运行start.bat，即可使用pm2方式启动应用
    6.停止并移除项目 rm.bat
```
### docker环境部署
```
    1.运行npm run build或者npm run obfuscator(加密打包) 会把所有的文件构建到dist文件夹中
    2. 拷贝dist文件夹所有内容到linux服务器上
    3. 在根目录下运行 ./start.sh，即可使用pm2方式启动应用
    4.停止并移除项目 ./rm.sh
```
## 项目结构说明
  ```
 |-- cpc
    |-- .dockerignore
    |-- .eslintrc.js
    |-- .gitignore
    |-- apidoc.js
    |-- directoryList.md
    |-- Dockerfile
    |-- LICENSE
    |-- nodemon.json
    |-- package.json
    |-- pm2.config.js
    |-- printDir.js
    |-- README.md
    |-- rm.bat
    |-- rm.sh
    |-- start.bat
    |-- start.sh
    |-- table.pdman.json
    |-- tsconfig.json
    |-- yarn-error.log
    |-- yarn.lock
    |-- bin
    |   |-- www
    |-- build
    |   |-- encryption.js
    |   |-- end.js
    |   |-- start.js
    |   |-- util
    |       |-- fileUtil.js
    |-- db
    |   |-- database.db
    |-- dist
    |   |-- .dockerignore
    |   |-- Dockerfile
    |   |-- package.json
    |   |-- pm2.config.js
    |   |-- rm.bat
    |   |-- rm.sh
    |   |-- start.bat
    |   |-- start.sh
    |   |-- bin
    |   |   |-- www
    |   |-- env
    |   |   |-- development.js
    |   |   |-- index.js
    |   |   |-- production.js
    |   |-- src
    |   |   |-- app.js
    |   |   |-- db
    |   |   |   |-- BaseTable.js
    |   |   |   |-- BaseView.js
    |   |   |   |-- index.js
    |   |   |   |-- tables
    |   |   |   |   |-- business
    |   |   |   |   |   |-- TableShop.js
    |   |   |   |   |-- rbac
    |   |   |   |       |-- TableResource.js
    |   |   |   |       |-- TableRole.js
    |   |   |   |       |-- TableUser.js
    |   |   |   |       |-- Table_role_resource.js
    |   |   |   |       |-- Table_user_role.js
    |   |   |   |-- views
    |   |   |       |-- ViewPermission.js
    |   |   |-- routes
    |   |   |   |-- controller
    |   |   |   |   |-- rbacCtrl.js
    |   |   |   |-- routers
    |   |   |       |-- index.js
    |   |   |       |-- rbac.js
    |   |   |-- types
    |   |   |   |-- types.js
    |   |   |-- utils
    |   |       |-- AntiUtil.js
    |   |       |-- AxiosUtil.js
    |   |       |-- CaptchaUtil.js
    |   |       |-- CryptoUtil.js
    |   |       |-- FileUtil.js
    |   |       |-- JoiUtil.js
    |   |       |-- JsUtil.js
    |   |       |-- NetUtil.js
    |   |       |-- NodemailerUtil.js
    |   |       |-- ResponseBeautifier.js
    |   |       |-- token
    |   |           |-- JwtUtil.js
    |   |           |-- pem
    |   |               |-- private_key.pem
    |   |               |-- public_key.pem
    |   |-- static
    |-- env
    |   |-- development.js
    |   |-- index.js
    |   |-- production.js
    |-- src
        |-- app.ts
        |-- apidoc
        |-- db
        |   |-- Base.ts
        |   |-- BaseTable.ts
        |   |-- BaseView.ts
        |   |-- index.ts
        |   |-- tables
        |   |   |-- business
        |   |   |   |-- TableShop.ts
        |   |   |-- rbac
        |   |       |-- TableResource.ts
        |   |       |-- TableRole.ts
        |   |       |-- TableUser.ts
        |   |       |-- Table_role_resource.ts
        |   |       |-- Table_user_role.ts
        |   |-- views
        |       |-- ViewPermission.ts
        |-- routes
        |   |-- controller
        |   |   |-- RbacCtrl.ts
        |   |-- routers
        |       |-- index.ts
        |       |-- rbac.ts
        |-- types
        |   |-- types.ts
        |-- utils
            |-- AntiUtil.ts
            |-- AxiosUtil.ts
            |-- CaptchaUtil.ts
            |-- CryptoUtil.ts
            |-- FileUtil.ts
            |-- JoiUtil.ts
            |-- JsUtil.ts
            |-- NetUtil.ts
            |-- NodemailerUtil.ts
            |-- ResponseBeautifier.ts
            |-- token
                |-- JwtUtil.ts
                |-- pem
                    |-- private_key.pem
                    |-- public_key.pem
  ```
  
  
## 其他说明
### 数据库的封装说明--增强对ts类型的约束
> 代码目录:/src/db/   
> Base.ts 封装了一堆查询的基础用法，可以加快开发效率    
> BaseTable.ts 建表基类--继承于Base.ts 封装了一堆通用的语句，比如分页查询等   
> BaseView.ts  建视图基类--继承于Base.ts   
> tables: 所有的表   
> views: 所有的视图   

建表示例：
 ```typescript
    // key：就是字段,value:就是字段的定义
    const table = {
        "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
        "account": "TEXT NOT NULL",//账号
        "password": "TEXT NOT NULL",//密码
        "name": "TEXT",//名称
        "description": "TEXT ",// 描述
    }
    //上面的等价于sqlite3的语句如下
    `CREATE TABLE IF NOT EXISTS 表名 (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        account TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT TEXT,
        description TEXT
    )`;
```
    
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
        const body = ctx.request.body as ITableUser;
        tableUser.insert(body);//会自动过滤不是user表的字段
        ResponseBeautifier.Success(ctx);
    }
```
### token的认证机制
代码目录:/utils/token/JwtUtil.js

> 封装了一个token认证的中间件   
> 对jsonwebtoken做了一层处理,分别为生成token,校验token，校验token中间件   
> 需要token校验的方法，直接使用token中间件即可，例如：   
```typescript
    // 需要验证的方法前，加入JwtUtil.middleware即可
    /**
     * @api {get} /rbac/user 用户-获取
     * @apiGroup rbac
     * @apiPermission admin
     * @apiHeader {String} access_token 授权token
     * @apiParam {String} name 用户名
     * @apiUse apiParamPage
     */
    router.get("/user", JoiUtil.middlewareByObject({
            name: Joi.string().optional().allow("", null),
            page: Joi.number().optional().allow("", null),
            size: Joi.number().optional().allow("", null),
        }
    ), JwtUtil.middleware, rbacCtrl.getUser);
    // 同时会把token中的信息解析出来后，放到headers的token_info里面，向下传递
    //获取用户信息
    async getUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        //超级管理员才有权限
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const query = ctx.query;
        const fields = tableUser.getFields(["password"]);//不要输出密码
        const data = tableUser.findByPage(query, "WHERE name LIKE '%' || :name || '%'", fields);
        ResponseBeautifier.Success(ctx, data);
    }
```
#### 生成公钥私钥
> 到目录/utils/token/pem/目录下，打开终端，使用openssl命令生成公钥私钥
```shell
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
```
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
### 接口参数校验
具体查看：utils/JoiUtil.ts文件
> 对参数的校验做了中间件的封装，详细请看源码

> 需要验证的方法前，加入JoiUtil.middlewareByObject即可 （需要自己去熟悉JOI的语法了）
```typescript
	//登录 如下所示，为account和password是必填项，同时是个字符串
    router.post("/login", JoiUtil.middlewareByObject({
            account: Joi.string().required(),
            password: Joi.string().required()
        }
    ), rbacCtrl.login);
```

### api接口文档生成
> 使用apidoc自动将注释生成api文档
```shell
   npm run apidoc  # 生成api文档，生成的文档放在/public/apidoc目录下
```

> 示例如下：
```typescript
/**
 * @api {get} /rbac/user 用户-获取
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} name 用户名
 * @apiParam {Number} [page=0] 页面索引
 * @apiParam {Number} [size=10] 每页个数
 */
router.get("/user", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        page: Joi.number().optional().default(10),
        size: Joi.number().optional().default(10),
    }
), JwtUtil.middleware, rbacCtrl.getUser);
```
