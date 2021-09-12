export const ResponseInfo = {
    success: {code: 200, msg: "操作成功!"},
    internalServerError: {code: 500, msg: "系统内部错误!"},
}

//统一返回格式
export class ResponseBeautifier {
    public static success(ctx: any, data: any = null) {
        const info = ResponseInfo.success;
        ctx.body = {code: info.code, msg: info.msg, data}
    }

    public static fail(ctx: any, info = ResponseInfo.internalServerError, data: any = null) {
        ctx.body = {code: info.code, msg: info.msg, data}
    }

}