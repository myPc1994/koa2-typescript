import Koa from 'koa';
import Router from 'koa-router';

const indexRouter = new Router();

indexRouter.get('/string', async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.a.w.t.t=1;
    ctx.body = 'koa2 string---水电费'
})

indexRouter.get('/json', async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})


export default indexRouter;