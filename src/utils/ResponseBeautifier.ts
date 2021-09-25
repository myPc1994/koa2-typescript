import {Context} from 'koa';

/**
 * 统一返回码类型
 */
export enum EResponseType {
    success = "success", // 成功
    internalServerError = "internalServerError",// 系统内部错误
    parameterError = "parameterError",// 参数错误
    dataError = "dataError",// 数据错误
}

/**
 * 统一返回的状态码，统一管理
 */
const ResponseInfo = {
    [EResponseType.success]: {code: 200, message: "操作成功!"},
    [EResponseType.internalServerError]: {code: 500, message: "系统内部错误!"},
    [EResponseType.parameterError]: {code: 401, message: "参数错误!"},
    [EResponseType.dataError]: {code: 402, message: "数据错误!"},
}

export interface IReturnInfo {
    type: EResponseType,
    data?: any,
    message?: string,
    error?: any,
}

/**
 * 统一返回格式
 */
export class ResponseBeautifier {
    public static success(ctx: Context, data: any = null, customMessage: string = "") {
        const {code, message} = ResponseInfo.success;
        ctx.body = {code, message: customMessage || message, data}
    }

    public static fail(ctx: Context, type: EResponseType, error: any = null, customMessage: string = "") {
        const info = ResponseInfo[type];
        ctx.body = {code: info.code, message: customMessage || info.message, error}
    }

    public static response(ctx: Context, res: IReturnInfo) {
        if (res.type === EResponseType.success) {
            console.log(res.data);
            return ResponseBeautifier.success(ctx, res.data, res.message);
        }
        return ResponseBeautifier.fail(ctx, res.type, res.error || res.data, res.message);
    }
}
