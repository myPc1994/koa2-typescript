import Router from 'koa-router';
import {RbacCtrl, RbacJoi} from "../controller/RbacCtrl";
import {JoiUtil} from "../../utils/JoiUtil";

const router = new Router({
    prefix: '/rbac'
});
// region 用户操作

/**
 * @api {post} /rbac/user 创建用户
 * @apiGroup 用户操作
 * @apiParam {String} account 用户名
 * @apiParam {String} password 密码
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.account 账号
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/user', JoiUtil.middleware(RbacJoi.addUser), RbacCtrl.addUser);
/**
 * @api {delete} /rbac/user 删除用户
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.delete('/user', JoiUtil.middleware(RbacJoi.deleteUser), RbacCtrl.deleteUser);
/**
 * @api {put} /rbac/user 修改用户
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiParam {String} [name] 用户别名
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.put('/user', JoiUtil.middleware(RbacJoi.putUser), RbacCtrl.putUser);
/**
 * @api {get} /rbac/user 查询用户信息
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.account 账号
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/user', JoiUtil.middleware(RbacJoi.getUser), RbacCtrl.getUser);
/**
 * @api {get} /rbac/users 查询所有用户
 * @apiGroup 用户操作
 * @apiUse findByPage
 * @apiSuccess (200) {Array} data.list 数据列表
 * @apiSuccess (200) {String} data.list.userId 用户id
 * @apiSuccess (200) {String} data.list.account 账号
 * @apiSuccess (200) {String} data.list.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/users', JoiUtil.middleware(RbacJoi.getUsers), RbacCtrl.getUsers);

// endregion
// region 用户-角色操作
/**
 * @api {post} /rbac/addRolesByUser 为用户添加指定的角色
 * @apiGroup 用户-角色操作
 * @apiParam {String} userId 用户id
 * @apiParam {Array} roles 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/addRolesByUser', JoiUtil.middleware(RbacJoi.addRolesByUser), RbacCtrl.addRolesByUser);
/**
 * @api {post} /rbac/addUsersByRole 为角色添加指定的用户
 * @apiGroup 用户-角色操作
 * @apiParam {String} roleId 角色id
 * @apiParam {Array} users 用户id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/addUsersByRole', JoiUtil.middleware(RbacJoi.addUsersByRole), RbacCtrl.addUsersByRole);
/**
 * @api {delete} /rbac/deleteUserRole 删除用户角色的关系
 * @apiGroup 用户-角色操作
 * @apiParam {String} userId 用户id
 * @apiParam {String} roleId 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.delete('/deleteUserRole', JoiUtil.middleware(RbacJoi.deleteUserRole), RbacCtrl.deleteUserRole);
/**
 * @api {get} /rbac/getRolesByUser 根据用户id查询所有角色
 * @apiGroup 用户-角色操作
 * @apiParam {String} userId 用户id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/getRolesByUser', JoiUtil.middleware(RbacJoi.getRolesByUser), RbacCtrl.getRolesByUser);
/**
 * @api {get} /rbac/getUsersByRole 根据角色id查询所有用户
 * @apiGroup 用户-角色操作
 * @apiParam {String} roleId 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/getUsersByRole', JoiUtil.middleware(RbacJoi.getUsersByRole), RbacCtrl.getUsersByRole);

// endregion
// region 角色操作

/**
 * @api {post} /rbac/role 创建角色
 * @apiGroup 角色操作
 * @apiParam {String} name 角色名
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/role', JoiUtil.middleware(RbacJoi.addRole), RbacCtrl.addRole);
/**
 * @api {delete} /rbac/role 删除角色
 * @apiGroup 角色操作
 * @apiParam {String} roleId 角色id
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.delete('/role', JoiUtil.middleware(RbacJoi.deleteRole), RbacCtrl.deleteRole);
/**
 * @api {put} /rbac/role 修改角色
 * @apiGroup 角色操作
 * @apiParam {String} roleId 角色id
 * @apiParam {String} [name] 角色名
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.put('/role', JoiUtil.middleware(RbacJoi.putRole), RbacCtrl.putRole);
/**
 * @api {get} /rbac/role 查询角色信息
 * @apiGroup 角色操作
 * @apiParam {String} roleId 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/role', JoiUtil.middleware(RbacJoi.getRole), RbacCtrl.getRole);
/**
 * @api {get} /rbac/roles 查询所有角色
 * @apiGroup 角色操作
 * @apiUse findByPage
 * @apiSuccess (200) {Array} data.list 数据列表
 * @apiSuccess (200) {String} data.list.roleId 角色id
 * @apiSuccess (200) {String} data.list.name 角色名
 * @apiSuccess (200) {String} data.list.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/roles', JoiUtil.middleware(RbacJoi.getRoles), RbacCtrl.getRoles);

// endregion
// region 角色-权限操作
/**
 * @api {post} /rbac/addRolesByAuth 为权限添加指定的角色
 * @apiGroup 角色-权限操作
 * @apiParam {String} authId 权限id
 * @apiParam {Array} roles 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/addRolesByAuth', JoiUtil.middleware(RbacJoi.addRolesByAuth), RbacCtrl.addRolesByAuth);
/**
 * @api {post} /rbac/addRolesByAuth 为角色添加指定的权限
 * @apiGroup 角色-权限操作
 * @apiParam {String} roleId 角色id
 * @apiParam {Array} auths 权限id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/addAuthsByRole', JoiUtil.middleware(RbacJoi.addAuthsByRole), RbacCtrl.addAuthsByRole);
/**
 * @api {delete} /rbac/addRolesByAuth 删除角色权限的关系
 * @apiGroup 角色-权限操作
 * @apiParam {String} roleId 角色id
 * @apiParam {String} authId 权限id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.delete('/deleteRoleAuth', JoiUtil.middleware(RbacJoi.deleteRoleAuth), RbacCtrl.deleteRoleAuth);
/**
 * @api {get} /rbac/getRolesByAuth 根据权限id查询所有角色
 * @apiGroup 角色-权限操作
 * @apiParam {String} authId 权限id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/getRolesByAuth', JoiUtil.middleware(RbacJoi.getRolesByAuth), RbacCtrl.getRolesByAuth);
/**
 * @api {get} /rbac/getAuthsByRole 根据角色id查询所有权限
 * @apiGroup 角色-权限操作
 * @apiParam {String} roleId 角色id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.roleId 角色id
 * @apiSuccess (200) {String} data.name 角色名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/getAuthsByRole', JoiUtil.middleware(RbacJoi.getAuthsByRole), RbacCtrl.getAuthsByRole);

// endregion
// region 权限操作

/**
 * @api {post} /rbac/auth 创建权限
 * @apiGroup 权限操作
 * @apiParam {String} type 大类（_router_）为路由的权限
 * @apiParam {String} subType 小类
 * @apiParam {String} name 权限名
 * @apiParam {String} describe 权限描述
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.type 大类
 * @apiSuccess (200) {String} data.subType 小类
 * @apiSuccess (200) {String} data.name 权限名称
 * @apiSuccess (200) {String} data.authId 权限id
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/auth', JoiUtil.middleware(RbacJoi.addAuth), RbacCtrl.addAuth);
//
/**
 * @api {delete} /rbac/auth 删除权限
 * @apiGroup 权限操作
 * @apiParam {String} authId 权限id
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.delete('/auth', JoiUtil.middleware(RbacJoi.deleteAuth), RbacCtrl.deleteAuth);
/**
 * @api {put} /rbac/auth 修改权限
 * @apiGroup 权限操作
 * @apiParam {String} authId 权限id
 * @apiParam {String} [type] 大类
 * @apiParam {String} [subType] 小类
 * @apiParam {String} [name] 权限名
 * @apiParam {String} [describe] 权限描述
 * @apiUse responseSuccess
 * @apiVersion 1.0.0
 */
router.put('/auth', JoiUtil.middleware(RbacJoi.putAuth), RbacCtrl.putAuth);
/**
 * @api {get} /rbac/auth 查询权限信息
 * @apiGroup 权限操作
 * @apiParam {String} authId 权限id
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.type 大类
 * @apiSuccess (200) {String} data.subType 小类
 * @apiSuccess (200) {String} data.name 权限名称
 * @apiSuccess (200) {String} data.describe 描述
 * @apiSuccess (200) {String} data.authId 权限id
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/auth', JoiUtil.middleware(RbacJoi.getAuth), RbacCtrl.getAuth);
/**
 * @api {get} /rbac/auths 查询所有权限
 * @apiGroup 权限操作
 * @apiUse findByPage
 * @apiSuccess (200) {Array} data.list 数据列表
 * @apiSuccess (200) {String} data.list.type 大类
 * @apiSuccess (200) {String} data.list.subType 小类
 * @apiSuccess (200) {String} data.list.name 权限名称
 * @apiSuccess (200) {String} data.list.describe 描述
 * @apiSuccess (200) {String} data.list.authId 权限id
 * @apiSuccess (200) {String} data.list.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/auths', JoiUtil.middleware(RbacJoi.getAuths), RbacCtrl.getAuths);

// endregion
export default router;
