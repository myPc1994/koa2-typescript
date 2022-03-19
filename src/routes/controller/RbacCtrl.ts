import {Context, Next} from 'koa';
import {Schema} from 'mongoose';
import {CryptoUtil} from "../../utils/CryptoUtil";
import {IReturnInfo, ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {UserCtrl} from "../../db/controller/rbac/UserCtrl";
import {JwtUtil} from "../../utils/token/JwtUtil";
import {IKeyValue} from "../../core/CpcInterface";
import {RoleCtrl} from "../../db/controller/rbac/RoleCtrl";
import {UserRoleCtrl} from "../../db/controller/rbac/UserRoleCtrl";
import {Auth, AuthCtrl} from "../../db/controller/rbac/AuthCtrl";
import {RoleAuthCtrl} from "../../db/controller/rbac/RoleAuthCtrl";

export class RbacCtrl {
// region 用户操作

    // 创建用户
    public static async addUser(ctx: Context, next: Next) {
        const {account, password} = ctx.request.body;
        const data: IReturnInfo = await UserCtrl.addUser(account, password);
        ResponseBeautifier.response(ctx, data);
    }

    // 删除用户
    public static async deleteUser(ctx: Context, next: Next) {
        const {userId} = ctx.request.body;
        const data: IReturnInfo = await UserCtrl.deleteUser(userId as string);
        ResponseBeautifier.response(ctx, data);
    }

    // 修改用户
    public static async putUser(ctx: Context, next: Next) {
        const {userId, name} = ctx.request.body;
        const data = await UserCtrl.updateOne({userId}, {name});
        if (data.matchedCount === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到对应的角色!");
        }
        if (!data.acknowledged) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "修改失败!");
        }
        ResponseBeautifier.success(ctx, null);
    }

    // 查询用户信息
    public static async getUser(ctx: Context, next: Next) {
        const {userId} = ctx.request.query;
        const fields = {password: 0, __v: 0, _id: 0};
        const data = await UserCtrl.findOne({userId}, fields);
        if (!data) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到该用户的信息!");
        }
        ResponseBeautifier.success(ctx, data);
    }

    // 查询所有用户
    public static async getUsers(ctx: Context, next: Next) {
        const {page = 0, limit = 10} = ctx.request.query;
        const fields = {account: 1, userId: 1, createTime: 1, _id: 0};
        const data = await UserCtrl.findByPage({}, fields, Number(page), Number(limit));
        ResponseBeautifier.success(ctx, data);
    }


// endregion
// region 用户-角色操作

    // 为用户添加指定的角色
    public static async addRolesByUser(ctx: Context, next: Next) {
        const {userId, roles} = ctx.request.body;
        if (roles.length === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "角色id不能为空!");
        }
        const dbUser = await UserCtrl.findOne({userId}, {userId: 1});
        if (!dbUser) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "用户不存在!");
        }
        const dbRoles = await RoleCtrl.find({roleId: {$in: roles}}, {roleId: 1});
        if (roles.length !== dbRoles.length) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "存在错误的角色id!");
        }
        const newRoles = dbRoles.map((item: IKeyValue) => ({roleId: item.roleId, userId}));
        const data = await UserRoleCtrl.saveOrFilterSame(["roleId", "userId"], newRoles);
        ResponseBeautifier.success(ctx, data);
    }

    // 为角色添加指定的用户
    public static async addUsersByRole(ctx: Context, next: Next) {
        const {roleId, users} = ctx.request.body;
        if (users.length === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "用户id不能为空!");
        }
        const dbRole = await RoleCtrl.findOne({roleId}, {roleId: 1});
        if (!dbRole) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "角色不存在!");
        }
        const dbUsers = await UserCtrl.find({userId: {$in: users}}, {userId: 1});
        if (users.length !== dbUsers.length) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "存在错误的用户id!");
        }
        const newUsers = dbUsers.map((item: IKeyValue) => ({userId: item.userId, roleId}));
        const data = await UserRoleCtrl.saveOrFilterSame(["roleId", "userId"], newUsers);
        ResponseBeautifier.success(ctx, data);
    }

    // 删除用户角色的关系
    public static async deleteUserRole(ctx: Context, next: Next) {
        const {userId, roleId} = ctx.request.query;
        const data = await UserRoleCtrl.deleteOne({userId, roleId});
        if (data.deletedCount === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "删除个数为0,删除失败!");
        }
        ResponseBeautifier.success(ctx, null);
    }

    // 根据用户id查询所有角色
    public static async getRolesByUser(ctx: Context, next: Next) {
        const {userId} = ctx.request.query;
        const data = await UserRoleCtrl.getRolesByUser(userId as string);
        ResponseBeautifier.success(ctx, data);
    }

    // 根据角色id查询所有用户
    public static async getUsersByRole(ctx: Context, next: Next) {
        const {roleId} = ctx.request.query;
        const data = await  UserRoleCtrl.getUsersByRole(roleId as string);
        ResponseBeautifier.success(ctx, data);
    }

// endregion
// region 角色操作

    // 创建角色
    public static async addRole(ctx: Context, next: Next) {
        const {name} = ctx.request.body;
        const data: IReturnInfo = await RoleCtrl.addRole(name);
        ResponseBeautifier.response(ctx, data);
    }

    // 删除角色
    public static async deleteRole(ctx: Context, next: Next) {
        const {roleId} = ctx.request.body;
        const data: IReturnInfo = await RoleCtrl.deleteRole(roleId as string);
        ResponseBeautifier.response(ctx, data);
    }

    // 修改角色
    public static async putRole(ctx: Context, next: Next) {
        const {roleId, name} = ctx.request.body;
        const data = await RoleCtrl.updateOne({roleId}, {name});
        if (data.matchedCount === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到对应的角色!");
        }
        if (!data.acknowledged) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "修改失败!");
        }
        ResponseBeautifier.success(ctx, null);
    }

    // 查询角色信息
    public static async getRole(ctx: Context, next: Next) {
        const {roleId} = ctx.request.query;
        const data = await RoleCtrl.findOne({roleId}, {_id: 0, __v: 0});
        ResponseBeautifier.success(ctx, data);
    }

    // 查询所有角色
    public static async getRoles(ctx: Context, next: Next) {
        const {page = 0, limit = 10} = ctx.request.query;
        const data = await RoleCtrl.findByPage({}, {_id: 0, __v: 0}, Number(page), Number(limit));
        ResponseBeautifier.success(ctx, data);
    }


// endregion
// region 角色-权限操作

    // 为权限添加指定的角色
    public static async addRolesByAuth(ctx: Context, next: Next) {
        const {authId, roles} = ctx.request.body;
        if (roles.length === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "角色id不能为空!");
        }
        const dbAuth = await AuthCtrl.findOne({authId}, {userId: 1});
        if (!dbAuth) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "权限不存在!");
        }
        const dbRoles = await RoleCtrl.find({roleId: {$in: roles}}, {roleId: 1});
        if (roles.length !== dbRoles.length) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "存在错误的角色id!");
        }
        const newRoles = dbRoles.map((item: IKeyValue) => ({roleId: item.roleId, authId}));
        const data = await RoleAuthCtrl.saveOrFilterSame(["roleId", "authId"], newRoles);
        ResponseBeautifier.success(ctx, data);
    }

    // 为角色添加指定的权限
    public static async addAuthsByRole(ctx: Context, next: Next) {
        const {roleId, auths} = ctx.request.body;
        if (auths.length === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "权限id不能为空!");
        }
        const dbRole = await RoleCtrl.findOne({roleId}, {roleId: 1});
        if (!dbRole) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "角色不存在!");
        }
        const dbAuths = await AuthCtrl.find({authId: {$in: auths}}, {authId: 1});
        if (auths.length !== dbAuths.length) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "存在错误的权限id!");
        }
        const newAuths = dbAuths.map((item: IKeyValue) => ({authId: item.authId, roleId}));
        const data = await RoleAuthCtrl.saveOrFilterSame(["roleId", "authId"], newAuths);
        ResponseBeautifier.success(ctx, data);
    }

    // 删除角色权限的关系
    public static async deleteRoleAuth(ctx: Context, next: Next) {
        const {roleId, authId} = ctx.request.query;
        const data = await RoleAuthCtrl.deleteOne({authId, roleId});
        if (data.deletedCount === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "删除个数为0,删除失败!");
        }
        ResponseBeautifier.success(ctx, null);
    }

    // 根据权限id查询所有角色
    public static async getRolesByAuth(ctx: Context, next: Next) {
        const {authId} = ctx.request.query;
        const data = await RoleAuthCtrl.getRolesByAuth(authId as string);
        ResponseBeautifier.success(ctx, data);
    }

    // 根据角色id查询所有权限
    public static async getAuthsByRole(ctx: Context, next: Next) {
        const {roleId} = ctx.request.query;
        const data = await  RoleAuthCtrl.getAuthsByRole(roleId as string);
        ResponseBeautifier.success(ctx, data);
    }

// endregion
// region 权限操作

    // 创建权限
    public static async addAuth(ctx: Context, next: Next) {
        const {type, subType, name,describe} = ctx.request.body;
        const data: IReturnInfo = await AuthCtrl.addAuth({type, subType, name, describe});
        ResponseBeautifier.response(ctx, data);
    }

    // 删除权限
    public static async deleteAuth(ctx: Context, next: Next) {
        const {authId} = ctx.request.body;
        const data: IReturnInfo = await AuthCtrl.deleteAuth(authId as string);
        ResponseBeautifier.response(ctx, data);
    }

    // 修改权限
    public static async putAuth(ctx: Context, next: Next) {
        const {authId, name, type, subType, describe} = ctx.request.body;
        const data = await AuthCtrl.updateOne({authId}, {name, type, subType, describe});
        if (data.matchedCount === 0) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到对应的权限!");
        }
        if (!data.acknowledged) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "修改失败!");
        }
        ResponseBeautifier.success(ctx, null);
    }

    // 查询权限信息
    public static async getAuth(ctx: Context, next: Next) {
        const {authId} = ctx.request.query;
        const data = await AuthCtrl.findOne({authId}, {_id: 0, __v: 0});
        if (!data) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到该权限的信息!");
        }
        ResponseBeautifier.success(ctx, data);
    }

    // 查询所有权限
    public static async getAuths(ctx: Context, next: Next) {
        const {page = 0, limit = 10} = ctx.request.query;
        const data = await AuthCtrl.findByPage({}, {_id: 0, __v: 0}, Number(page), Number(limit));
        ResponseBeautifier.success(ctx, data);
    }

// endregion
}