import {Context, Next} from 'koa';
import Router from 'koa-router';
import {EResponseType, ResponseBeautifier} from "../tools/ResponseBeautifier";
import {UserCtrl} from "../db/controller/rbac/UserCtrl";
import {CaptchaTool} from "../tools/CaptchaTool";
import {CryptoTool} from "../tools/CryptoTool";
import {JwtTool} from "../tools/token/JwtTool";
import {IKeyValue} from "../core/CpcInterface";
import {JoiUtil} from "../joi/JoiUtil";

const usersRouter = new Router({
    prefix: '/users'
});
usersRouter.get('/captcha', async (ctx: Context, next: Next) => {
    const obj = CaptchaTool.createMath();
    ResponseBeautifier.success(ctx, obj);
})
// 加入验证码验证  usersRouter.post('/login', JoiTool.middleware(JoiTool.users.login), CaptchaTool.middleware(), async (ctx: Context, next: Next) => {
usersRouter.post('/login',  JoiUtil.middleware(JoiUtil.users.login), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const saltPassword = CryptoTool.saltHashPassword(password, userName);// 密码加盐
    const userInfo: any = await UserCtrl.findOne({userName, password: saltPassword}, {_id: 1});
    if (!userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "用户名或者密码错误!");
    }
    userInfo.access_token = await JwtTool.generateToken(userInfo, "7d");// 7天有效
    ResponseBeautifier.success(ctx, userInfo);
})

usersRouter.post('/register',  JoiUtil.middleware(JoiUtil.users.register), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const userInfo = await UserCtrl.findOne({userName});
    if (userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "该用户已存在!");
    }
    const saltPassword = CryptoTool.saltHashPassword(password, userName);// 密码加盐
    const res: IKeyValue = await UserCtrl.save({userName, password: saltPassword});
    ResponseBeautifier.success(ctx, {
        _id: res._id,
        userName: res.userName,
        createTime: res.createTime
    });
})

// 需要验证的方法前，加入JwtTool.middleware即可
usersRouter.get('/verifyToken', JwtTool.middleware, async (ctx: Context, next: Next) => {
    ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
})

usersRouter.get('/userInfo', JwtTool.middleware, async (ctx: Context, next: Next) => {
    const {_id} = ctx.header.token_info as any;
    const userInfo: any = await UserCtrl.findOne({_id}, {
        _id: 1,
        userName: 1,
        roleIds: 1,
        createTime: 1
    });
    if (!userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "找不到对应的用户信息!");
    }
    ResponseBeautifier.success(ctx, userInfo);
})


export default usersRouter;
