import {JoiUtil} from "../../utils/JoiUtil";
import Joi from "joi";
import Router from "koa-router";
import {JwtUtil} from "../../utils/token/JwtUtil";
import {rbacCtrl} from "../controller/RbacCtrl";

const router = new Router({prefix: "/rbac"});
/**
 * @api {post} /rbac/login 用户-登录
 * @apiGroup rbac
 * @apiParam {String} account 用户名
 * @apiParam {String}  password 密码
 */
router.post("/login", JoiUtil.middlewareByObject({
        account: Joi.string().required().error(new Error("账号必填")),
        password: Joi.string().required().error(new Error("密码必填"))
    }
), rbacCtrl.login);
/**
 * @api {get} /rbac/user 用户-获取
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} name 用户名
 * @apiUse apiParamPage
 */
router.get("/user", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        page: Joi.number().optional().default(10),
        size: Joi.number().optional().default(10),
    }
), JwtUtil.middleware, rbacCtrl.getUser);
/**
 * @api {post} /rbac/user 用户-创建
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} account 用户名
 * @apiParam {String}  password 密码
 * @apiParam {String}  [name] 昵称
 * @apiParam {String}  [description] 描述
 */
router.post("/user", JoiUtil.middlewareByObject({
        account: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.postUser);
/**
 * @api {put} /rbac/user 用户-更新
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {String}  [password] 密码
 * @apiParam {String}  [name] 昵称
 * @apiParam {String}  [description] 描述
 */
router.put("/user", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        password: Joi.string().optional().allow("", null),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putUser);
/**
 * @api {delete} /rbac/user?id=:id 用户-删除
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.delete("/user", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
    }
), JwtUtil.middleware, rbacCtrl.deleteUser);
/**
 * @api {get} /rbac/role 角色-获取
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} [name] 角色名称
 * @apiUse apiParamPage
 */
router.get("/role", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        page: Joi.number().optional().allow("", null),
        size: Joi.number().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.getRole);
/**
 * @api {post} /rbac/role 角色-创建
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} [name] 角色名称
 * @apiParam {String} [description] 角色描述
 */
router.post("/role", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.postRole);
/**
 * @api {put} /rbac/role 角色-更新
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 角色id
 * @apiParam {String} [name] 角色名称
 * @apiParam {String} [description] 角色描述
 */
router.put("/role", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putRole);
/**
 * @api {delete} /rbac/role?id=:id 角色-删除
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 角色id
 */
router.delete("/role", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
    }
), JwtUtil.middleware, rbacCtrl.deleteRole);

/**
 * @api {get} /rbac/resource 资源-查询
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} [name] 资源名称
 * @apiUse apiParamPage
 */
router.get("/resource", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        page: Joi.number().optional().allow("", null),
        size: Joi.number().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.getResource);
/**
 * @api {post} /rbac/resource 资源-创建
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String}  name 资源名称
 * @apiParam {String}  type 资源类型
 * @apiParam {String}  [description] 描述
 */
router.post("/resource", JoiUtil.middlewareByObject({
        name: Joi.string().required(),
        type: Joi.string().required(),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.postResource);
/**
 * @api {put} /rbac/resource 资源-更新
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {String}  [name] 资源名称
 * @apiParam {String}  [type] 资源类型
 * @apiParam {String}  [description] 描述
 */
router.put("/resource", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        name: Joi.string().optional().allow("", null),
        type: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putResource);
/**
 * @api {delete} /rbac/resource?id=:id 资源-删除
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.delete("/resource", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
    }
), JwtUtil.middleware, rbacCtrl.deleteResource);

/**
 * @api {post} /rbac/bindUserRoles 绑定（用户-角色）
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {Array} roles 角色id数组
 */
router.post("/bindUserRoles", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        roles: Joi.array().items(Joi.string()).required(),
    }
), JwtUtil.middleware, rbacCtrl.bindUserRoles);
/**
 * @api {post} /rbac/bindRoleUsers 绑定（角色-用户）
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {Array} users 用户id数组
 */
router.post("/bindRoleUsers", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        users: Joi.array().items(Joi.string()).required(),
    }
), JwtUtil.middleware, rbacCtrl.bindRoleUsers);
/**
 * @api {post} /rbac/bindRoleResources 绑定（角色-资源）
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {Array} resources 角色id数组
 */
router.post("/bindRoleResources", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        resources: Joi.array().items(Joi.string()).required(),
    }
), JwtUtil.middleware, rbacCtrl.bindRoleResources);
/**
 * @api {post} /rbac/bindResourceRoles 绑定（资源-角色）
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiParam {Array} roles 角色id数组
 */
router.post("/bindResourceRoles", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        roles: Joi.array().items(Joi.string()).required(),
    }
), JwtUtil.middleware, rbacCtrl.bindResourceRoles);

/**
 * @api {get} /rbac/getRolesByUser 根据用户id获取所有角色
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getRolesByUser", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getRolesByUser);
/**
 * @api {get} /rbac/getResourcesByUser 根据用户id获取所有资源
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getResourcesByUser", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getResourcesByUser);
/**
 * @api {get} /rbac/getResourcesByRole 根据角色id获取所有资源
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getResourcesByRole", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getResourcesByRole);
/**
 * @api {get} /rbac/getUsersByRole 根据角色id获取所有用户
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getUsersByRole", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getUsersByRole);
/**
 * @api {get} /rbac/getRolesByResource 根据资源id获取所有角色
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getRolesByResource", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getRolesByResource);
/**
 * @api {get} /rbac/getUsersByResource 根据资源id获取所有用户
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 */
router.get("/getUsersByResource", JoiUtil.middlewareByObject({
        id: Joi.string().required()
    }
), JwtUtil.middleware, rbacCtrl.getUsersByResource);
/**
 * @api {get} /rbac/selfUser 个人-获取自己的信息
 * @apiGroup rbac
 * @apiHeader {String} access_token 授权token
 */
router.get("/selfUser", JwtUtil.middleware, rbacCtrl.getSelfUser);
//更新自己的用户信息
/**
 * @api {put} /rbac/selfUser 个人-更新自己的信息
 * @apiGroup rbac
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} [name] 昵称
 * @apiParam {String} [description] 描述
 */
router.put("/selfUser", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putSelfUser);
/**
 * @api {get} /rbac/selfPermission 个人-获取自己的权限
 * @apiGroup rbac
 * @apiHeader {String} access_token 授权token
 */
router.get("/selfPermission", JwtUtil.middleware, rbacCtrl.getSelfPermission);
export default router;
