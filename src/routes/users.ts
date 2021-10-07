import {Context, Next} from 'koa';
import Router from 'koa-router';
import {UserCtrl} from "../db/controller/UserCtrl";
import {EResponseType, IReturnInfo, ResponseBeautifier} from "../utils/ResponseBeautifier";
import {JwtUtil} from "../utils/token/JwtUtil";
import {CryptoUtil} from "../utils/CryptoUtil";
import {JoiUtil} from "../utils/JoiUtil";
import {IKeyValue} from "../core/CpcInterface";

const usersRouter = new Router({
    prefix: '/users'
});
usersRouter.post('/login', JoiUtil.middleware(JoiUtil.users.login), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
    const userInfo: any = await UserCtrl.instance.findOne({userName, password: saltPassword}, {
        userId: 1,
        userName: 1,
        _id: 0
    });
    if (!userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "用户名或者密码错误!");
    }
    userInfo.access_token = await JwtUtil.generateToken(userInfo, 30);
    ResponseBeautifier.success(ctx, userInfo);
})

usersRouter.post('/register', JoiUtil.middleware(JoiUtil.users.register), async (ctx: Context, next: Next) => {
    const {userName, password} = ctx.request.body;
    const userInfo = await UserCtrl.instance.findOne({userName});
    if (userInfo) {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, null, "该用户已存在!");
    }
    const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
    const res: IKeyValue = await UserCtrl.instance.save({userName, password: saltPassword});
    ResponseBeautifier.success(ctx, {
        userId: res.userId,
        userName: res.userName,
        roleIds: res.roleIds,
        createTime: res.createTime
    });
})

// 需要验证的方法前，加入JwtUtil.middleware即可
usersRouter.get('/verifyToken', JwtUtil.middleware, async (ctx: Context, next: Next) => {
    ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
})


export default usersRouter;
