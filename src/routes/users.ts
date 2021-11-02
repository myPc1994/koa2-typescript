import {Context, Next} from 'koa';
import Router from 'koa-router';
import {EResponseType, ResponseBeautifier} from "../utils/ResponseBeautifier";
import {UserCtrl} from "../db/controller/rbac/UserCtrl";
import {CaptchaUtil} from "../utils/CaptchaUtil";
import {CryptoUtil} from "../utils/CryptoUtil";
import {JwtUtil} from "../utils/token/JwtUtil";
import {IKeyValue} from "../core/CpcInterface";
import {JoiUtil} from "../utils/joi/JoiUtil";
import {JoiUsers} from "../utils/joi/routes/JoiUsers";

const usersRouter = new Router({
    prefix: '/users'
});
usersRouter.get('/captcha', async (ctx: Context, next: Next) => {
    const obj = CaptchaUtil.createMath();
    ResponseBeautifier.success(ctx, obj);
})
// 加入验证码验证  usersRouter.post('/login', JoiUtil.middleware(JoiUtil.users.login), CaptchaUtil.middleware(), async (ctx: Context, next: Next) => {
usersRouter.post('/login',  JoiUtil.middleware(JoiUsers.login), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
    const userInfo: any = await UserCtrl.findOne({userName, password: saltPassword}, {_id: 1});
    if (!userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "用户名或者密码错误!");
    }
    userInfo.access_token = await JwtUtil.generateToken(userInfo, "7d");// 7天有效
    ResponseBeautifier.success(ctx, userInfo);
})

usersRouter.post('/register',  JoiUtil.middleware(JoiUsers.register), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const userInfo = await UserCtrl.findOne({userName});
    if (userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "该用户已存在!");
    }
    const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
    const res: IKeyValue = await UserCtrl.save({userName, password: saltPassword});
    ResponseBeautifier.success(ctx, {
        _id: res._id,
        userName: res.userName,
        createTime: res.createTime
    });
})

// 需要验证的方法前，加入JwtUtil.middleware即可
usersRouter.get('/verifyToken', JwtUtil.middleware, async (ctx: Context, next: Next) => {
    ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
})

usersRouter.get('/userInfo', JwtUtil.middleware, async (ctx: Context, next: Next) => {
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
