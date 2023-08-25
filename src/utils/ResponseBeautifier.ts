import {Context} from 'koa';
import {EResponseCode, IResponse, ResponseCodeToMsg} from "../types/types";

/**
 * 统一返回格式
 */
export class ResponseBeautifier {
    /**
     * 格式化
     * @param code 状态码
     * @param data 数据
     * @param msg 自定义的提示信息
     */
    public static format(code: EResponseCode, msg?: string, data?: any): IResponse {
        msg = msg || ResponseCodeToMsg[code];
        return {code, msg, data}
    }

    /**
     * 返回结果
     * @param ctx koa的上下文对象
     * @param code 状态码
     * @param data 数据
     * @param message 自定义的提示信息
     */
    public static response(ctx: Context, code: EResponseCode, message?: string, data?: any) {
        ctx.body = this.format(code, message,data)
    }

    /**
     * 处理成功，状态码为200
     * @param  ctx koa的上下文对象
     * @param data 数据
     * @param {string} message 自定义的提示信息
     */
    public static Success(ctx: Context, data?: any, message?: string) {
        ResponseBeautifier.response(ctx, EResponseCode.Success, message, data);
    }

    /**
     * 错误的请求 状态码为400
     * @param ctx  koa的上下文对象
     * @param message 自定义的提示信息
     * @param data 数据
     */
    public static BadRequest(ctx: Context, message?: string, data?: any) {
        ResponseBeautifier.response(ctx, EResponseCode.BadRequest, message, data);
    }

    /**
     * 系统错误状态码为500
     * @param ctx  koa的上下文对象
     * @param message 自定义的提示信息
     * @param data 数据
     */
    public static InternalServerError(ctx: Context, message?: string, data?: any) {
        ResponseBeautifier.response(ctx, EResponseCode.InternalServerError, message, data);
    }

    /**
     * 权限不足
     * @param ctx  koa的上下文对象
     * @param message 自定义的提示信息
     * @param data 数据
     */
    public static Forbidden(ctx: Context, message?: string, data?: any) {
        ResponseBeautifier.response(ctx, EResponseCode.Forbidden, message, data);
    }

    /**
     * 未授权
     * @param ctx  koa的上下文对象
     * @param message 自定义的提示信息
     * @param data 数据
     */
    public static Unauthorized(ctx: Context, message?: string, data?: any) {
        ResponseBeautifier.response(ctx, EResponseCode.Unauthorized, message, data);
    }

}