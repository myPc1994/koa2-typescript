import {Context} from 'koa';

export enum ResponseCode {
    success = 200,// 正常返回
    badRequest = 400,// 表示其他错误，就是4xx都无法描述的错误
    parameterError = 401,// 参数错误
    dataError = 402,// 参数没有错误，但是数据内容不允许
    tokenError = 403,//token错误
    captchaError = 405,//验证码错误
    permissionError = 406,//权限不足
    internalServerError = 500,// 表示其他错误，就是5xx都无法描述的错误
}

/**
 * 返回格式
 */
export interface IReturnInfo {
    code: ResponseCode,
    message: string,
    data?: any,
}


/**
 * 统一返回的状态码，统一管理
 */
export const ResponseInfo = {
    success: {code: ResponseCode.success, message: "成功!"},
    badRequest: {code: ResponseCode.badRequest, message: "错误请求!"},
    parameterError: {code: ResponseCode.parameterError, message: "参数错误!"},
    dataError: {code: ResponseCode.dataError, message: "数据错误!"},
    permissionError: {code: ResponseCode.permissionError, message: "权限不足!"},
    tokenError: {code: ResponseCode.tokenError, message: "token错误或者过期!"},
    captchaError: {code: ResponseCode.captchaError, message: "验证码错误或者过期!"},
    internalServerError: {code: ResponseCode.internalServerError, message: "系统内部错误!"},
}

/**
 * 统一返回格式
 */
export class ResponseBeautifier {
    /**
     * 成功返回
     * @param  ctx koa的上下文对象
     * @param data 数据
     * @param {string} describe 描述
     */
    public static success(ctx: Context, data: any, curMessage?: string) {
        ResponseBeautifier.responseByStatus(ctx, ResponseInfo.success, curMessage, data);
    }

    /**
     * 根据状态返回结果
     * @param ctx koa的上下文对象
     * @param {{code: number; message: string}} statusInfo 状态信息
     * @param data 数据
     * @param {string} describe 描述
     */
    public static responseByStatus(ctx: Context, statusInfo = ResponseInfo.success, curMessage = "", data: any = "") {
        const {code, message} = statusInfo;
        const info = {code, message: curMessage || message, data: undefined};
        if (data || data === 0) {
            info.data = data;
        }
        ResponseBeautifier.response(ctx, info);
    }

    /**
     * 返回结果
     * @param ctx koa的上下文对象
     * @param {IReturnInfo} info 返回的信息
     */
    public static response(ctx: Context, info: IReturnInfo) {
        ctx.body = info
    }
}
