declare global {
    // eslint-disable-next-line no-var
    var _envConfig: {
        env: 'development'|'production', //环境名称
        agreement: "http",//协议
        port: string,//端口
        db:{//数据库配置
            path:string,
            options?:any
        }
    }
}

/**
 * 定义统一的{key:value}格式
 */
export interface IKeyValue<T> {
    [key: string | number]: T
}


/**
 * 枚举所有的返回状态码，与EResponseMsg消息一一对应，如果没有自定义提示信息，将使用这里面的
 */
export enum EResponseCode {
    Success = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    TooManyRequests = 429,
    InternalServerError = 500,
}

/**
 * 状态码对应的默认提示信息
 */
export const ResponseCodeToMsg: Record<EResponseCode, string> = {
    [EResponseCode.Success]: "请求成功",
    [EResponseCode.BadRequest]: "请求无效",
    [EResponseCode.Unauthorized]: "未授权", //(可以表示客户端请求未经授权或授权已过期)
    [EResponseCode.Forbidden]: "禁止访问", // 表示服务器理解客户端的请求，但拒绝执行它，因为客户端没有足够的权限来执行该操作）
    [EResponseCode.NotFound]: "未找到",
    [EResponseCode.TooManyRequests]: "请求过多",
    [EResponseCode.InternalServerError]: "服务器内部错误",
};

/**
 * 统一返回
 */
export interface IResponse {
    code: number,
    msg?: string,
    data?: any,
}