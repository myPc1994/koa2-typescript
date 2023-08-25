import {JoiUtil} from "../../utils/JoiUtil";
import Joi from "joi";
import Router from "koa-router";
import {rbacCtrl} from "../controller/rbacCtrl";
import {JwtUtil} from "../../utils/token/JwtUtil";

const router = new Router({prefix: "/rbac"});
/**
 * @api {post} /rbac/login 用户-登录
 * @apiGroup rbac
 * @apiParam {String} account 用户名
 * @apiParam {String}  password 密码
 * @apiUse responseCodeMsg
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
 * @apiUse responseCodeMsg
 */
router.get("/user", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
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
 * @apiUse responseCodeMsg
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
 * @apiUse responseCodeMsg
 */
router.put("/user", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        password: Joi.string().optional().allow("", null),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
),  JwtUtil.middleware,rbacCtrl.putUser);
/**
 * @api {delete} /rbac/user 用户-删除
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} id 用户id
 * @apiUse responseCodeMsg
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
 * @apiUse responseCodeMsg
 */
router.get("/role", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.getRole);
/**
 * @api {post} /rbac/role 角色-创建
 * @apiGroup rbac
 * @apiPermission admin
 * @apiHeader {String} access_token 授权token
 * @apiParam {String} [name] 角色名称
 * @apiParam {String} [description] 角色描述
 * @apiUse responseCodeMsg
 */
router.post("/role", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.postRole);
router.put("/role", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putRole);
router.delete("/role", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
    }
), JwtUtil.middleware, rbacCtrl.deleteRole);
// 权限的查询
router.get("/permission", JwtUtil.middleware, rbacCtrl.getPermission);

//获取自己的用户信息
router.get("/selfUser", JwtUtil.middleware, rbacCtrl.getSelfUser);
//更新自己的用户信息
router.put("/selfUser", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.putSelfUser);
//获取自己的权限
router.get("/selfPermission", JwtUtil.middleware, rbacCtrl.getSelfPermission);
export default router;
