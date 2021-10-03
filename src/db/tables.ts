import {v1} from 'uuid';

/**
 * 所有表格的统一管理
 */
export enum ETables {
    application = "application",// 应用/项目
    user = "user", // 用户
    role = "role",// 角色
    permission = "permission",// 权限
}

/**
 * 所有表格字段的限制管理
 */
export const tables = {
    [ETables.application]: {
        appId: {type: String, default: () => v1()},
        name: {type: String, required: true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
    [ETables.user]: {
        userId: {type: String, default: () => v1()},
        userName: {type: String, required: true},
        password: {type: String, required: true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
    [ETables.role]: {
        roleId: {type: String, default: () => v1()},
        name: {type: String, required: true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
    [ETables.permission]: {
        permissionId: {type: String, default: () => v1()},
        name: {type: String, required: true},
        createTime: {type: String, default: () => new Date().getTime()},
    },
}

