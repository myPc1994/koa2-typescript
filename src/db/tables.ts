import {v1} from 'uuid';

/**
 * 所有表格的统一管理
 */
export enum ETables {
    user = "user", // 用户
    role = "role",// 角色
    permission = "permission",// 权限
}

/**
 * 所有表格字段的限制管理
 */
export const tables = {
    [ETables.user]: {
        userId: {type: String, default: () => v1()},
        userName: {type: String, required: true,unique:true},
        password: {type: String, required: true},
        roleIds: [String],
        createTime: {type: String, default: () => new Date().getTime()},
    },
    [ETables.role]: {
        roleId: {type: String, default: () => v1()},
        userIds: [String],
        permissionIds: [String],
        name: {type: String, required: true,unique:true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
    [ETables.permission]: {
        roleIds: [String],
        permissionId: {type: String, default: () => v1()},
        name: {type: String, required: true,unique:true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
}

