import {JoiUtil} from "../../utils/JoiUtil";
import Joi from "joi";
import {ResponseBeautifier} from "../../utils/ResponseBeautifier";
import Router from "koa-router";

const router = new Router({prefix: "/"});
/**
 * @apiDefine responseSuccess
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 状态码说明
 * @apiSuccess (200) {Object} data 数据内容
 */

router.get("/", JoiUtil.middlewareByObject({id: Joi.string().optional()}), async (ctx, next) => {
    console.log(ctx.cookies.get("__yjs_duid"));
    console.log(ctx.cookies.get("H_WISE_SIDS_BFESS"));
    console.log(ctx.cookies.get("BDUSS_BFESS"));
    console.log(ctx.cookies.get("H_PS_645EC"));
    ResponseBeautifier.success(ctx, {ok: true})
});
export default router;
