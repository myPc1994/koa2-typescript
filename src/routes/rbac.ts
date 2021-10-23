import {Context, Next} from 'koa';
import Router from 'koa-router';
import {ResponseBeautifier} from "../tools/ResponseBeautifier";
import {JoiUtil} from "../joi/JoiUtil";
import {RbacUtil} from "../db/controller/rbac/RbacUtil";

const rbacRouter = new Router({
    prefix: '/rbac'
});
// 为用户添加指定的角色
rbacRouter.post('/addUserRoles', JoiUtil.middleware(JoiUtil.rbac.addUserRoles), async (ctx: Context, next: Next) => {
    const {userId, roles} = ctx.request.body;
    const res = await RbacUtil.addUserRoles(userId, roles);
    ResponseBeautifier.success(ctx, res);
})
export default rbacRouter;
