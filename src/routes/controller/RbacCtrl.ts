import {Context} from "koa";
import { ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {ITableUser, tableUser} from "../../db/tables/rbac/TableUser";
import {JwtUtil} from "../../utils/token/JwtUtil";
import {ITableRole, tableRole} from "../../db/tables/rbac/TableRole";
import {v1} from "uuid";
import {viewPermission} from "../../db/views/ViewPermission";

export const rbacCtrl = {
    //用户登录
    async login(ctx: Context) {
        const body = ctx.request.body as ITableUser;
        const user = tableUser.findOne(body, undefined, ["id"]);
        if (!user) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.badRequest, "账号或者密码错误!");
        }
        const token = await JwtUtil.generateToken({id: user.id})
        ResponseBeautifier.success(ctx, {token});
    },

    //获取用户信息
    async getUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        //超级管理员才有权限
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        // const query = ctx.query as any;
        // const data = tableUser.findByLeftJoin(query.name, query.page, query.size);
        // data.data.forEach(item => item.password = "***");
        // ResponseBeautifier.success(ctx, data);
    },
    //创建用户
    async postUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const body = ctx.request.body as ITableUser
        body.id = v1()
        tableUser.createUser(body);
        ResponseBeautifier.success(ctx, null);
    },
    //修改用户
    async putUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const body = ctx.request.body as ITableUser
        const finRes = tableUser.findOne({id: body.id});
        if (!finRes) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "数据库中不存在该id");
        }
        // ‘***’ 是我的加密方式，不做修改，与返回的结果一一对应
        if (body.password === "***") {
            delete body.password;
        }
        tableUser.updateUser(body)
        ResponseBeautifier.success(ctx, null);
    },
    //删除用户
    async deleteUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const id = ctx.query.id as string;
        if (id === "admin") {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.badRequest, "超级管理员不允许删除")
        }
        tableUser.delete2(id)
        ResponseBeautifier.success(ctx, null);
    },
    //获取角色列表
    async getRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const query = ctx.query as any;
        const where = tableRole.allowFields(query, undefined, undefined);
        const data = tableRole.findByLeftJoin(where, query.page, query.size);
        ResponseBeautifier.success(ctx, data);
    },
    //创建角色
    async postRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const body = ctx.request.body as ITableRole;
        body.id = v1();
        tableRole.createRole(body);
        ResponseBeautifier.success(ctx, null);
    },
    //修改角色
    async putRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const body = ctx.request.body as ITableRole;
        const finRes = tableRole.findOne({id: body.id});
        if (!finRes) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "数据库中不存在该id");
        }
        tableRole.updateRole(body);
        ResponseBeautifier.success(ctx, null);
    },
    //删除角色
    async deleteRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const id = ctx.query.id as string;
        tableRole.delete2(id)
        ResponseBeautifier.success(ctx, null);
    },
    //获取权限列表
    async getPermission(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if(tokenInfo.id !== "admin"){
            return ResponseBeautifier.responseByStatus(ctx,ResponseInfo.permissionError)
        }
        const data = viewPermission.find();
        ResponseBeautifier.success(ctx, data);
    },

    //获取自己的信息
    async getSelfUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        const user = tableUser.findOne({id: tokenInfo.id}) as ITableUser;
        user.password = "***";
        ResponseBeautifier.success(ctx, user);
    },
    //修改自己的信息
    async putSelfUser(ctx: Context) {
        const body = ctx.request.body as ITableUser
        const updateData = {description: body.description} as ITableUser;
        if (body.password !== "***") {
            updateData.password = body.password;
        }
        const tokenInfo: any = ctx.req.headers.token_info;
        tableUser.update({id: tokenInfo.id}, updateData);
        ResponseBeautifier.success(ctx, null);
    },
    //获取自己的权限
    async getSelfPermission(ctx: Context) {
        // const tokenInfo: any = ctx.req.headers.token_info;
        // let permissions = [];
        // if (tokenInfo.id === "admin") {
        //     permissions = viewPermission.find();
        // } else {
        //     permissions = tableUser.findPermissions({id: tokenInfo.id});
        // }
        // ResponseBeautifier.success(ctx, permissions);
    }
}
