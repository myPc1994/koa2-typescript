import {JoiUtil} from "../../utils/JoiUtil";
import Joi from "joi";
import Router from "koa-router";
import {rbacCtrl} from "../controller/rbacCtrl";
import {JwtUtil} from "../../utils/token/JwtUtil";

const router = new Router({prefix: "/rbac"});
//登录
router.post("/login", JoiUtil.middlewareByObject({
        account: Joi.string().required(),
        password: Joi.string().required()
    }
), rbacCtrl.login);
//获取用户信息
router.get("/user", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.getUser);
//创建用户
router.post("/user", JoiUtil.middlewareByObject({
        account: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.postUser);
//更新用户信息
router.put("/user", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
        account: Joi.string().optional().allow("", null),
        password: Joi.string().optional().allow("", null),
        name: Joi.string().optional().allow("", null),
        description: Joi.string().optional().allow("", null),
    }
),  JwtUtil.middleware,rbacCtrl.putUser);
//删除用户
router.delete("/user", JoiUtil.middlewareByObject({
        id: Joi.string().required(),
    }
), JwtUtil.middleware, rbacCtrl.deleteUser);
//角色的增删改查
router.get("/role", JoiUtil.middlewareByObject({
        name: Joi.string().optional().allow("", null),
    }
), JwtUtil.middleware, rbacCtrl.getRole);
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
