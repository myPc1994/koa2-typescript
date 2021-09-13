import {Context} from 'koa';
export const ResponseInfo = {
    success: {code: 200, msg: "操作成功!"},
    internalServerError: {code: 500, msg: "系统内部错误!"},
    parameterError: {code: 401, msg: "参数错误!"},
}

// 统一返回格式
export class ResponseBeautifier {
    public static success(ctx: Context, data: any = null) {
        const info = ResponseInfo.success;
        ctx.body = {code: info.code, msg: info.msg, data}
    }

    public static fail(ctx: Context, info = ResponseInfo.internalServerError, data: any = null) {
        ctx.body = {code: info.code, msg: info.msg, data}
    }

}
