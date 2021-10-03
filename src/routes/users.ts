import {Context, Next} from 'koa';
import Router from 'koa-router';
import {UserCtrl} from "../db/controller/UserCtrl";
import {EResponseType, IReturnInfo, ResponseBeautifier} from "../utils/ResponseBeautifier";
import {JwtUtil} from "../utils/token/JwtUtil";

const usersRouter = new Router({
    prefix: '/users'
});
usersRouter.post('/login', async (ctx: Context, next: Next) => {
    // TODO 验证用户信息
    // TODO 验证成功后
    const res = {accessToken: ""};// 基本用户信息，不要包含涉密信息
    res.accessToken = await JwtUtil.generateToken({userId: "xxxaa", "info": "xsdfs水电费"}, 30);
    ResponseBeautifier.success(ctx, res);
})

usersRouter.post('/register', async (ctx: Context, next: Next) => {
    ResponseBeautifier.success(ctx, {});
})

// 需要验证的方法前，加入JwtUtil.middleware即可
usersRouter.get('/verifyToken', JwtUtil.middleware, async (ctx: Context, next: Next) => {
    ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
})


export default usersRouter;
