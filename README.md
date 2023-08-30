# koa2+ts+apidoc的起手式项目
### 整体介绍

CSDN地址：[博客地址](https://blog.csdn.net/chen_p_cheng/article/details/132591279)

掘金地址：[掘金地址](https://juejin.cn/spost/7273026570941005863#heading-0)

项目地址：[项目地址](https://gitee.com/CPC1994/koa2-typescript)

> 开发框架：koa2


> 开发语言：Nodejs、TypeScript


> 数 据 库：Sqlite3


>  数据库操作插件：better-sqlite3


> token生成与验证：jsonwebtoken


> 日志插件：无（直接console.log,console.error即可）   
> 开发环境: 会直接在控制台打印   
> 生产环境：pm2会自动记录日志，并放在./logs/目录下


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

### 打包优势：打包完后会生成一个dist文件夹，将ts文件转为js,同时允许对源代码加密混淆（防止源码泄露）

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




## 相关封装的类库使用说明
###  路由设计方式，分为接入层（routes/routers）和业务控制层(routes/controller)

#### 接入层

1.这里只做数据的接入和参数的校验

```typescript
    /**
 * @api {post} /rbac/login 用户-登录
 * @apiGroup rbac
 * @apiParam {String} account 用户名
 * @apiParam {String}  password 密码
 */
router.post("/login", JoiUtil.middlewareByObject({
        account: Joi.string().required().error(new Error("账号必填")),
        password: Joi.string().required().error(new Error("密码必填"))
    }
), rbacCtrl.login);
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
        page: Joi.number().optional().default(10),
        size: Joi.number().optional().default(10),
    }
    //这里的JwtUtil.middleware，是token认证的中间件
), JwtUtil.middleware, rbacCtrl.getUser);
```
2.注释使用apidoc格式注释，方便生成api文档,生成的文档如下所示
> 使用apidoc自动将注释生成api文档

```shell
   npm run apidoc  # 生成api文档，生成的文档放在/public/apidoc目录下
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/3098d54043644e70bd4dbb02e3631486.png)

#### 接入层

1.这里用户处理业务逻辑

```typescript
  export const rbacCtrl = {
    //用户登录
    async login(ctx: Context) {
    	//转换为ITableUser类型
        const body = ctx.request.body as ITableUser;
        //数据库表的操作做了findOne等一些基础操作的封装，具体看Base.ts源码，优点：简化了查询，提高效率
        const user = tableUser.findOne(body, "WHERE account=:account AND password=:password", ["id"]);
        if (!user) {
            return ResponseBeautifier.BadRequest(ctx, "账号或者密码错误!");
        }
        //对jwt进行了封装，用于token生成和校验，这里只存入用户的id（不建议存入太多数据，不然token会变大，影响传输效率）
        const token = await JwtUtil.generateToken({id: user.id})
        //封装了统一格式的返回，具体看ResponseBeautifier源码
        ResponseBeautifier.Success(ctx, {token});
    },

    //获取用户信息
    async getUser(ctx: Context) {
    	//在接入层如果书写了JwtUtil.middleware，那么就可以直接ctx.req.headers.token_info获取token存在的数据，具体看源码JwtUtil.ts
        const tokenInfo: any = ctx.req.headers.token_info;
        //超级管理员才有权限
        if (tokenInfo.id !== "admin") {
        	//封装了统一格式的返回，这里是权限不足，具体看ResponseBeautifier源码
            return ResponseBeautifier.Forbidden(ctx)
        }
        //获取查询的参数
        const query = ctx.query as { name?: string, page?: number, size?: number };
        //对于表中的密码字段不要输出，过滤掉password，具体看源码Base.ts
        const fields = tableUser.getFields(["password"]);//不要输出密码
        //Base.ts统一封装了findByPage，用于做统一的分页查询
        const data = tableUser.findByPage(query, "WHERE name LIKE '%' || :name || '%'", fields);
        ResponseBeautifier.Success(ctx, data);
    }
}
```
### 数据库的封装说明--增强对ts类型的约束

> 代码位置:/src/db/   
> Base.ts 封装了一堆通用查询的基础用法，可以加快开发效率    
> BaseTable.ts 建表基类--继承于`Base.ts` 封装了一堆通用的语句，比如分页查询等   
> BaseView.ts  建视图基类--继承于`Base.ts `  
> tables目录: 所有的表   ，必须继承`BaseTable.ts`
> views目录: 所有的视图   ，必须继承`BaseView.ts`

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

数据操作类封装的优势：

> 1.独立了每个表的操作逻辑 (每个ts文件，对应一张表，对应表的相关逻辑，比如：初始化表数据，配合`node-schedule`做数据作业的调度等等操作)
> 2. 增强ts的类型检测(能够动态生成了表的字段的ts类型，如下示例的`ITableUser`，可以辅助业务逻辑的智能提示)   
     > 3.增强了对表字段的检测(在`Base.ts`中封装了`allowFields`、`parseSqlData`、`getFields`等方法增强字段的过滤，解析等)
> 4. 统一了表名变量，防止书写错误 (所有的`sql`语句中涉及表名的书写都一律使用`this.name`，防止字符串书写错误)   
     > 5.提高业务代码书写效率 (例如：`Base.ts`直接统一了数据查询的分页操作，批量数据插入，简单查询等等)
```typescript
import {BaseTable} from "../../BaseTable";
import {table_user_role} from "./Table_user_role";
import {database} from "../../index";
import {ITableRole, tableRole} from "./TableRole";
import {ITableResource, tableResource} from "./TableResource";
import {table_role_resource} from "./Table_role_resource";
// 用户表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
    "account": "TEXT NOT NULL",//账号
    "password": "TEXT NOT NULL",//密码
    "name": "TEXT",//名称
    "description": "TEXT ",// 描述
}
//用户表拥有的所有字段类型
export type ITableUser = {
    [key in keyof typeof table]?: any
}

class Table extends BaseTable<ITableUser> {
    constructor(tableName: string) {
        super(tableName, table);
       	// 可以对整个表做初始化的操作，例如：插入一个数据等等
        this.insertOrUpdate({
            id: "admin",
            account: "admin",
            password: "admin",
            name: "超级管理员",
            description: "权限最高拥有者",
        })
    }
    //根据用户id获取所有角色
    public getRoles(id: string) {
        const sql = `SELECT t_role.* FROM ${tableRole.name} AS t_role
                            INNER JOIN ${table_user_role.name} AS t_user_role ON t_user_role.userId='${id}' and t_role.id =t_user_role.roleId`;
       return  database.prepare(sql).all() as ITableRole[];
    }
    //根据用户id获取所有资源
    public getResources(id: string) {
        const sql = `select t_resource.* from ${tableResource.name} AS t_resource
                            INNER JOIN ${table_role_resource.name} AS t_role_resource on t_resource.id =t_role_resource.resourceId
                            INNER JOIN ${table_user_role.name} AS t_user_role on t_user_role.userId='${id}' AND t_role_resource.roleId=t_user_role.roleId
                            `;
        return  database.prepare(sql).all() as ITableResource[];
    }
	//根据用户id绑定角色
    public bindRoles(id: string, roles: string[]) {
        database.transaction(() => {
            table_user_role.delete({userId: id}, "WHERE userId=:userId");
            table_user_role.inserts(roles.map(roleId => ({userId: id, roleId})))
        })()
    }
	//删除用户---删除用户id，要同时去删除对应的关联表的数据等业务，在这里书写
    public delete2(id: string) {
        return database.transaction(() => {
            this.delete({id}, "WHERE id=:id");
            table_user_role.delete({userId: id}, "WHERE userId=:userId");
        })();
    }

}

export const tableUser = new Table("tableUser");

```
### 接口参数校验

具体查看：utils/JoiUtil.ts文件

> 对参数的校验做了中间件的封装，详细请看源码


> 需要验证的方法前，加入JoiUtil.middlewareByObject即可 （需要自己去熟悉JOI的语法了）

```typescript
	//登录 如下所示，为account和password是必填项，同时是个字符串，没有填写，提示对应的错误
   /**
	 * @api {post} /rbac/login 用户-登录
	 * @apiGroup rbac
	 * @apiParam {String} account 用户名
	 * @apiParam {String}  password 密码
	 */
	router.post("/login", JoiUtil.middlewareByObject({
	        account: Joi.string().required().error(new Error("账号必填")),
	        password: Joi.string().required().error(new Error("密码必填"))
	    }
	), rbacCtrl.login);
```

### token的认证机制

代码目录:/utils/token/JwtUtil.js

> 封装了一个token认证的中间件   
> 对jsonwebtoken做了一层处理,分别为生成token,校验token，校验token中间件   
> 需要token校验的方法，直接使用token中间件即可，例如：

```typescript
    // 需要验证的方法前，加入JwtUtil.middleware即可
    router.get("/user", JoiUtil.middlewareByObject({
            name: Joi.string().optional().allow("", null),
     		....
        }
    ), JwtUtil.middleware, rbacCtrl.getUser);
    
    //获取用户信息
    async getUser(ctx: Context) {
    	// 同时会把token中的信息解析出来后，放到headers的token_info里面，向下传递
        const tokenInfo: any = ctx.req.headers.token_info;
        ....
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
   /**
 * 枚举所有的返回状态码，与EResponseMsg消息一一对应
 */
export enum EResponseCode {
    Success = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    TooManyRequests = 429,
    InternalServerError = 500,
}

/**
 * 状态码对应的默认提示信息,如果没有自定义提示信息，将使用这里面的
 */
export const ResponseCodeToMsg: Record<EResponseCode, string> = {
    [EResponseCode.Success]: "请求成功",
    [EResponseCode.BadRequest]: "请求无效",
    [EResponseCode.Unauthorized]: "未授权", //(可以表示客户端请求未经授权或授权已过期)
    [EResponseCode.Forbidden]: "禁止访问", // 表示服务器理解客户端的请求，但拒绝执行它，因为客户端没有足够的权限来执行该操作）
    [EResponseCode.NotFound]: "未找到",
    [EResponseCode.TooManyRequests]: "请求过多",
    [EResponseCode.InternalServerError]: "服务器内部错误",
};

/**
 * 统一返回
 */
export interface IResponse {
    code: number,
    msg?: string,
    data?: any,
}
```

> 示例如下

```typescript
     ResponseBeautifier.Success(ctx, data);
     ResponseBeautifier.Forbidden(ctx)
     ResponseBeautifier.response(ctx, EResponseCode.Unauthorized, "缺少token!")
     ....
```
### 源码加密保护(javascript-obfuscator)

> 加密日志如下所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/76c44fc3648e44ee80c82b0dfd56ccc3.png)


> 打包未加密代码如下所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5338beb3ed5b44b88bba83ac5c805f7c.png)

> 打包加密的代码如下所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f08598b1f1134ae6ab3e412fa2c75b77.png)


## Description of the project structure

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
    |   |-- useful
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