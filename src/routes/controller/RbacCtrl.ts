import {Context} from "koa";
import {ResponseBeautifier} from "../../utils/ResponseBeautifier";
import {ITableUser, tableUser} from "../../db/tables/rbac/TableUser";
import {JwtUtil} from "../../utils/token/JwtUtil";
import {ITableRole, tableRole} from "../../db/tables/rbac/TableRole";
import {v1} from "uuid";
import {viewPermission} from "../../db/views/ViewPermission";
import {ITableResource, tableResource} from "../../db/tables/rbac/TableResource";

export const rbacCtrl = {
    //用户登录
    async login(ctx: Context) {
        const body = ctx.request.body as ITableUser;
        const user = tableUser.findOne(body, "WHERE account=:account AND password=:password", ["id"]);
        if (!user) {
            return ResponseBeautifier.BadRequest(ctx, "账号或者密码错误!");
        }
        const token = await JwtUtil.generateToken({id: user.id})
        ResponseBeautifier.Success(ctx, {token});
    },

    //获取用户信息
    async getUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        //超级管理员才有权限
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const query = ctx.query as any;
        const fields = tableUser.getFields(["password"]);//不要输出密码
        const data = tableUser.findByPage(query, "WHERE name LIKE '%' || :name || '%'", fields);
        ResponseBeautifier.Success(ctx, data);
    },
    //创建用户
    async postUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableUser
        const userInfo = tableUser.findOne({account: body.account}, "WHERE account=:account");
        if (userInfo) {
            return ResponseBeautifier.BadRequest(ctx, "账号已存在!");
        }
        body.id = v1();
        tableUser.insert(body);
        ResponseBeautifier.Success(ctx);
    },
    //修改用户
    async putUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableUser
        const finRes = tableUser.findOne(body, "WHERE id=:id");
        if (!finRes) {
            return ResponseBeautifier.BadRequest(ctx, "不存在该用户");
        }
        delete body.account;//不允许修改账户名
        tableUser.update(body, "WHERE id=:id")
        ResponseBeautifier.Success(ctx);
    },
    //删除用户
    async deleteUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx);
        }
        const id = ctx.query.id as string;
        if (id === "admin") {
            return ResponseBeautifier.BadRequest(ctx, "超级管理员不允许删除")
        }
        tableUser.delete2(id)
        ResponseBeautifier.Success(ctx);
    },
    //获取角色列表
    async getRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const query = ctx.query as any;
        const data = tableRole.findByPage(query, "WHERE name LIKE '%' || :name || '%'");
        ResponseBeautifier.Success(ctx, data);
    },
    //创建角色
    async postRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableRole
        body.id = v1();
        tableRole.insert(body);
        ResponseBeautifier.Success(ctx);
    },
    //修改角色
    async putRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableRole;
        const finRes = tableRole.findOne(body, "WHERE id=:id");
        if (!finRes) {
            return ResponseBeautifier.BadRequest(ctx, "不存在该角色");
        }
        tableRole.update(body, "WHERE id=:id");
        ResponseBeautifier.Success(ctx);
    },
    //删除角色
    async deleteRole(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const id = ctx.query.id as string;
        tableRole.delete2(id)
        ResponseBeautifier.Success(ctx);
    },
    //获取资源
    async getResource(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const query = ctx.query as any;
        query.name = query.name || "";
        const data = tableResource.findByPage(query, "WHERE name LIKE '%' || :name || '%'");
        ResponseBeautifier.Success(ctx, data);
    },
    //创建资源
    async postResource(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableResource
        body.id = v1();
        tableResource.insert(body);
        ResponseBeautifier.Success(ctx);
    },
    //请求资源
    async putResource(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const body = ctx.request.body as ITableResource;
        const finRes = tableResource.findOne(body, "WHERE id=:id");
        if (!finRes) {
            return ResponseBeautifier.BadRequest(ctx, "不存在该资源");
        }
        tableResource.update(body, "WHERE id=:id");
        ResponseBeautifier.Success(ctx);
    },
    //删除资源
    async deleteResource(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const id = ctx.query.id as string;
        tableResource.delete2(id)
        ResponseBeautifier.Success(ctx);
    },

    //获取权限列表
    async getPermission(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const data = viewPermission.find();
        ResponseBeautifier.Success(ctx, data);
    },
    // 绑定（用户-角色）
    async bindUserRoles(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const {id, roles} = ctx.request.body as { id: string, roles: string[] };
        if(id === "admin"){
            return ResponseBeautifier.BadRequest(ctx, "超级管理员无法绑定角色");
        }
        const finRes = tableUser.findOne({id}, "WHERE id=:id");
        if (!finRes) {
            return ResponseBeautifier.BadRequest(ctx, "不存在该用户");
        }
        tableUser.bindRoles(id, roles);
        ResponseBeautifier.Success(ctx);
    },
    // 绑定（角色-用户）
    async bindRoleUsers(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const {id, users} = ctx.request.body as { id: string, users: string[] };
        const admins = users.filter(id=>id==="admin");
        if(admins.length > 0){
            return ResponseBeautifier.BadRequest(ctx, "角色无法绑定超级管理员");
        }
        tableRole.bindUsers(id, users);
        ResponseBeautifier.Success(ctx);
    },
    // 绑定（角色-资源）
    async bindRoleResources(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const {id, resources} = ctx.request.body as { id: string, resources: string[] };
        tableRole.bindResources(id, resources);
        ResponseBeautifier.Success(ctx);
    },
    // 绑定（资源-角色）
    async bindResourceRoles(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        if (tokenInfo.id !== "admin") {
            return ResponseBeautifier.Forbidden(ctx)
        }
        const {id, roles} = ctx.request.body as { id: string, roles: string[] };
        tableResource.bindRoles(id, roles);
        ResponseBeautifier.Success(ctx);
    },
    //获取自己的信息
    async getSelfUser(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        const fields = tableUser.getFields(["password"]);//不要输出密码
        const user = tableUser.findOne(tokenInfo, "WHERE id=:id", fields);
        ResponseBeautifier.Success(ctx, user);
    },
    //修改自己的信息
    async putSelfUser(ctx: Context) {
        const body = ctx.request.body as ITableUser
        const tokenInfo: any = ctx.req.headers.token_info;
        body.id = tokenInfo.id;
        delete body.password;
        tableUser.update(body, "WHERE id=:id");
        ResponseBeautifier.Success(ctx, null);
    },
    //获取自己的权限
    async getSelfPermission(ctx: Context) {
        const tokenInfo: any = ctx.req.headers.token_info;
        let permissions;
        //超级管理员拥有所有权限
        if (tokenInfo.id === "admin") {
            permissions = viewPermission.find();
        } else {
            permissions = viewPermission.findByUserId(tokenInfo.id);
        }
        ResponseBeautifier.Success(ctx, permissions);
    }
}
