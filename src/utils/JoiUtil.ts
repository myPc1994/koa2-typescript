import Joi, {AnySchema} from 'joi'
import {Context, Next} from 'koa';
import {IKeyValue} from "../types/types";
import {ResponseBeautifier} from "./ResponseBeautifier";

/**
 * JOI工具类
 */
export class JoiUtil {
    /**
     * joi参数识别的中间件
     * @param {Joi.Schema} schema 需要判断的参数JOI格式
     * @param {"query" | "body"} method 判断是query参数，还是body参数,auto:自动判断
     * @param {"query" | "body" | "auto"} method 参数是放在query还是body中
     *                                      query：强制使用query方式解析
     *                                      body：强制使用body方式解析
     *                                       auto：默认的，get|delete方式使用query，其他使用body解析
     */
    public static middleware(schema: Joi.Schema, method: "query" | "body" | "auto" = "auto") {
        return async function (ctx: Context, next: Next) {
            let parameName: "query" | "body";
            if (method === "auto") {
                const methodType: string = ctx.method.toLocaleLowerCase();
                if (methodType === "get" || methodType == "delete") {
                    parameName = "query";
                } else {
                    parameName = "body";
                }
            } else {
                parameName = method;
            }
            const data = ctx.request[parameName];
            const {error} = schema.validate(data);
            if (error) {
                return ResponseBeautifier.BadRequest(ctx, error.message);
            }
            return next();
        };
    }

    /**
     * joi参数识别的中间件
     * @param {IKeyValue} obj 需要判断的参数JOI格式
     * @param {"query" | "body"} method 判断是query参数，还是body参数,auto:自动判断
     * @param {"query" | "body" | "auto"} method 参数是放在query还是body中
     *                                      query：强制使用query方式解析
     *                                      body：强制使用body方式解析
     *                                      auto：默认的，get|delete方式使用query，其他使用body解析
     */
    public static middlewareByObject(obj: IKeyValue<AnySchema>, method: "query" | "body" | "auto" = "auto") {
        const schema = Joi.object(obj).options({allowUnknown: true});
        return this.middleware(schema,method)
    }
}
