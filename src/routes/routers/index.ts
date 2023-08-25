import {JoiUtil} from "../../utils/JoiUtil";
import Joi from "joi";
import {ResponseBeautifier} from "../../utils/ResponseBeautifier";
import Router from "koa-router";

const router = new Router({prefix: "/"});
/**
 * @apiDefine responseCodeMsg 请求结果的基础格式
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} message 状态码说明
 * @apiSuccessExample  {json} Success:
 *      {
 *        "code": 200,
 *        "msg": "请求成功",
 *      }
 * @apiErrorExample  {json} BadRequest:
 *      {
 *        "code": 400,
 *        "msg": "请求无效",
 *      }
 * @apiErrorExample {json} Unauthorized:
 *      {
 *        "code": 401,
 *        "msg": "未授权",
 *      }
 * @apiErrorExample {json} Forbidden:
 *      {
 *        "code": 403,
 *        "msg": "禁止访问",
 *      }
 * @apiErrorExample {json} NotFound:
 *      {
 *        "code": 404,
 *        "msg": "未找到",
 *      }
 * @apiErrorExample {json} TooManyRequests:
 *      {
 *        "code": 429,
 *        "msg": "请求过多",
 *      }
 * @apiErrorExample {json} InternalServerError:
 *      {
 *        "code": 500,
 *        "msg": "服务器内部错误",
 *      }
 */
/**
 * @apiDefine apiParamPage 分页请求
 * @apiParam {Number} [page=0] 页面索引
 * @apiParam {Number} [size=10] 每页个数
 */


/**
 * @api {get} / 初始页面
 * @apiVersion 0.0.0
 * @apiGroup index
 * @apiUse responseCodeMsg
 */
router.get("/", async (ctx, next) => {
    ResponseBeautifier.Success(ctx)
});
export default router;
