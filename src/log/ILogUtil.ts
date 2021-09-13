import {Context,Next} from "koa";
export enum ELevel {
    error = "error",
    info = "info",
    warn = "warn",
}

// 日志抽象类
export abstract class ILogUtil {

    public getClientIp(req: any) {
        const ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
        return ip.replace("::ffff:", "");
    }

    public getClinetInfo(ctx: Context) {
        const ip = this.getClientIp(ctx.req);// 客户端ip地址
        let {originalUrl, method} = ctx;
        let params = JSON.stringify(method === "GET" ? ctx.query : (ctx.request as any).body);
        let browserType = ctx.req.headers['user-agent'];
        return {originalUrl, method, ip, params, browserType};
    }

    public formatError(error: any, clientInfo: string) {
        let logText = "";
        logText += "\n" + "*************** 错误日志 start ***************" + "\n";
        logText += "客户端请求信息:" + clientInfo + "\n";
        logText += "错误名称: " + error.name + "\n";
        logText += "错误信息: " + error.message + "\n";
        logText += "错误栈: " + error.stack + "\n";
        logText += "*************** 错误日志 end ***************" + "\n";
        return logText;
    }

    public abstract log(level: ELevel, msg: string): void;

    public net() {
        return async (ctx: Context, next: Next) => {
            // 响应开始时间
            const start = new Date().getTime();
            // 响应间隔时间
            let ms;
            try {
                // 开始进入到下一个中间件
                await next();
                ms = new Date().getTime() - start;
                this.netResponse(ctx, ms);// 记录响应日志
            } catch (error: any) {
                ms = new Date().getTime() - start;
                this.netError(ctx, error, ms); // 记录异常日志
                ctx.throw();
            }
        }
    };

    public abstract netResponse(ctx: Context, time: number): void;

    public abstract netError(ctx: Context, error: any, time: number): void;

}
