import {Context} from "koa";
import {IncomingMessage} from "http";

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
        let {originalUrl, method} = ctx;
        let params = JSON.stringify(method === "GET" ? ctx.query : (ctx.request as any).body);
        let browserType = ctx.req.headers['user-agent'];
        return {originalUrl, method, ip, params, browserType};
    }
}