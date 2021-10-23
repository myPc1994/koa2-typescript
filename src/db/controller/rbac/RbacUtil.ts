import {UserRoleCtrl} from "./UserRoleCtrl";

export class RbacUtil {
    /**
     * 为用户添加指定的角色
     * @param {string} userId 用户id
     * @param {string[]} roles 角色id组
     */
    public static addUserRoles(userId: string, roles: string[]) {
        const data = roles.map(roleId => ({roleId, userId}));
        return UserRoleCtrl.saves(data)
    }

    /**
     * 去除用户的某些角色
     * @param {string} userId 用户id
     * @param {string[]} roles 角色id组
     */
    public static removeUserRoles(userId: string, roles: string[]) {
        return UserRoleCtrl.deleteMany({userId: userId, roleId: {$all: roles}})
    }

    /**
     * 获取用户的所有角色
     * @param {string} userId
     * @returns {any}
     */
    public static userRoles(userId: string) {
        return UserRoleCtrl.find({userId});
    }

    /**
     * 获取角色的所有用户
     * @param {string} roleId
     */
    public static roleUsers(roleId: string) {
        return UserRoleCtrl.find({roleId});
    }

    /**
     * 用户是否具有该角色
     * @param {string} userId
     * @param {string} roleId
     * @returns {Boolean}
     */
    public static hasRole(userId: string, roleId: string): boolean {
        return UserRoleCtrl.findOne({userId, roleId}) !== null;
    }

    // public static addRoleParents() {
    // }
    //
    // public static removeRoleParents() {
    // }

    /**
     * 删除角色
     */
    // public static removeRole(roleId:string) {
    //
    // }
    //
    // public static removeResource() {
    // }
    //
    // public static allow() {
    // }
    //
    // public static removeAllow() {
    // }
    //
    // public static allowedPermissions() {
    // }
    //
    // public static isAllowed() {
    // }
    //
    // public static areAnyRolesAllowed() {
    // }
    //
    // public static whatResources() {
    // }
    //
    // public static middleware() {
    // }
    //
    // public static backend() {
    // }
}