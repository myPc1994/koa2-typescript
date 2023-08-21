import {Context} from "koa";
import {IncomingMessage} from "http";

/**
 * 网络处理工具类
 */
export class NetUtil {
    public static getClientIp(req: IncomingMessage) {
        const ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection as any).socket.remoteAddress || '';
        return ip.replace("::ffff:", "");
    }

    public static getClinetInfo(ctx: Context) {
        const ip = NetUtil.getClientIp(ctx.req);// 客户端ip地址
        const {originalUrl, method} = ctx;
        const params = JSON.stringify(method === "GET" ? ctx.query : (ctx.request as any).body);
        const browserType = ctx.req.headers['user-agent'];
        return {originalUrl, method, ip, params, browserType};
    }
}
