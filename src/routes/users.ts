import Koa from 'koa';
import Router from 'koa-router';
import {UserCtrl} from "../db/controller/UserCtrl";
import {ResponseBeautifier} from "../utils/ResponseBeautifier";

const usersRouter = new Router({
    prefix: '/users'
});
usersRouter.get('/string', async (ctx: Koa.Context, next: Koa.Next) => {
    const res = await UserCtrl.instance.save({
        user: "是否",
        price: "xxxxxxx"
    })
    ResponseBeautifier.success(ctx, res);
})

usersRouter.get('/json', async (ctx: Koa.Context, next: Koa.Next) => {
    const data = await UserCtrl.instance.find();
    ResponseBeautifier.success(ctx, data);
})


export default usersRouter;
