import {Context} from 'koa';

export const ResponseInfo = {
    success: {code: 200, message: "操作成功!"},
    internalServerError: {code: 500, message: "系统内部错误!"},
    parameterError: {code: 401, message: "参数错误!"},
    dataError: {code: 402, message: "数据错误!"},
}

// 统一返回格式
export class ResponseBeautifier {
    public static success(ctx: Context, data: any = null, customMessage: string = "") {
        const {code, message} = ResponseInfo.success;
        ctx.body = {code, message: customMessage || message, data}
    }

    public static fail(ctx: Context, info = ResponseInfo.internalServerError, error: any = null) {
        ctx.body = {code: info.code, msg: info.message, error}
    }

}
