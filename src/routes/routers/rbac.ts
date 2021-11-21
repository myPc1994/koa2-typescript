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
 * @apiParam {String} userName 用户名
 * @apiParam {String} password 密码
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.userName 用户名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.post('/user', JoiUtil.middleware(RbacJoi.addUser), RbacCtrl.addUser);
/**
 * @api {delete} /rbac/user 删除用户
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.userName 用户名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.delete('/user', JoiUtil.middleware(RbacJoi.deleteUser), RbacCtrl.deleteUser);
/**
 * @api {put} /rbac/user 修改用户
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiParam {String} [name] 用户别名
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.userName 用户名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.put('/user', JoiUtil.middleware(RbacJoi.putUser), RbacCtrl.putUser);
/**
 * @api {get} /rbac/user 查询用户信息
 * @apiGroup 用户操作
 * @apiParam {String} userId 用户id
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.userId 用户id
 * @apiSuccess (200) {String} data.userName 用户名称
 * @apiSuccess (200) {String} data.createTime 创建时间
 * @apiVersion 1.0.0
 */
router.get('/user', JoiUtil.middleware(RbacJoi.getUser), RbacCtrl.getUser);
// 查询所有用户
router.get('/users', JoiUtil.middleware(RbacJoi.getUsers), RbacCtrl.getUsers);

// endregion
// region 用户-角色操作

// 为用户添加指定的角色
router.post('/addRolesByUser', JoiUtil.middleware(RbacJoi.addRolesByUser), RbacCtrl.addRolesByUser);
// 为角色添加指定的用户
router.post('/addUsersByRole', JoiUtil.middleware(RbacJoi.addUsersByRole), RbacCtrl.addUsersByRole);
// 删除用户角色的关系
router.delete('/deleteUserRole', JoiUtil.middleware(RbacJoi.deleteUserRole), RbacCtrl.deleteUserRole);
// 根据用户id查询所有角色
router.get('/getRolesByUser', JoiUtil.middleware(RbacJoi.getRolesByUser), RbacCtrl.getRolesByUser);
// 根据角色id查询所有用户
router.get('/getUsersByRole', JoiUtil.middleware(RbacJoi.getUsersByRole), RbacCtrl.getUsersByRole);

// endregion
// region 角色操作

// 创建角色
router.post('/role', JoiUtil.middleware(RbacJoi.addRole), RbacCtrl.addRole);
// 删除角色
router.delete('/role', JoiUtil.middleware(RbacJoi.deleteRole), RbacCtrl.deleteRole);
// 修改角色
router.put('/role', JoiUtil.middleware(RbacJoi.putRole), RbacCtrl.putRole);
// 查询角色信息
router.get('/role', JoiUtil.middleware(RbacJoi.getRole), RbacCtrl.getRole);
// 查询所有角色
router.get('/roles', JoiUtil.middleware(RbacJoi.getRoles), RbacCtrl.getRoles);

// endregion
// region 角色-权限操作

// 为权限添加指定的角色
router.post('/addRolesByAuth', JoiUtil.middleware(RbacJoi.addRolesByAuth), RbacCtrl.addRolesByAuth);
// 为角色添加指定的权限
router.post('/addAuthsByRole', JoiUtil.middleware(RbacJoi.addAuthsByRole), RbacCtrl.addAuthsByRole);
// 删除角色权限的关系
router.delete('/deleteRoleAuth', JoiUtil.middleware(RbacJoi.deleteRoleAuth), RbacCtrl.deleteRoleAuth);
// 根据权限id查询所有角色
router.get('/getRolesByAuth', JoiUtil.middleware(RbacJoi.getRolesByAuth), RbacCtrl.getRolesByAuth);
// 根据角色id查询所有权限
router.get('/getAuthsByRole', JoiUtil.middleware(RbacJoi.getAuthsByRole), RbacCtrl.getAuthsByRole);

// endregion
// region 权限操作

// 创建权限
router.post('/auth', JoiUtil.middleware(RbacJoi.addAuth), RbacCtrl.addAuth);
// 删除权限
router.delete('/auth', JoiUtil.middleware(RbacJoi.deleteAuth), RbacCtrl.deleteAuth);
// 修改权限
router.put('/auth', JoiUtil.middleware(RbacJoi.putAuth), RbacCtrl.putAuth);
// 查询权限信息
router.get('/auth', JoiUtil.middleware(RbacJoi.getAuth), RbacCtrl.getAuth);
// 查询所有权限
router.get('/auths', JoiUtil.middleware(RbacJoi.getAuths), RbacCtrl.getAuths);

// endregion
export default router;
