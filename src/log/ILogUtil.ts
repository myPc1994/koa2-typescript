export enum ELevel {
    error = "error",
    info = "info",
    warn = "warn",
}
// 日志抽象类
export abstract class ILogUtil {

    getClientIp(req: any) {
        const ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
        return ip.replace("::ffff:", "");
    }

    getClinetInfo(ctx: any) {
        const ip = this.getClientIp(ctx.req);//客户端ip地址
        let {originalUrl, method} = ctx;
        let params = JSON.stringify(method === "GET" ? ctx.query : ctx.request.body);
        let browserType = ctx.req.headers['user-agent'];
        return {originalUrl, method, ip, params, browserType};
    }

    formatError(error: any, clientInfo: string) {
        var logText = new String();
        //错误信息开始
        logText += "\n" + "*************** 错误日志 start ***************" + "\n";
        logText += "客户端请求信息:" + clientInfo + "\n";
        //错误名称
        logText += "错误名称: " + error.name + "\n";
        //错误信息
        logText += "错误信息: " + error.message + "\n";
        //错误详情
        logText += "错误栈: " + error.stack + "\n";
        //错误信息结束
        logText += "*************** 错误日志 end ***************" + "\n";
        return logText;
    }

    abstract log(level: ELevel, msg: string): void;

    net() {
        return async (ctx: any, next: any) => {
            //响应开始时间
            const start = new Date().getTime();
            //响应间隔时间
            let ms;
            try {
                //开始进入到下一个中间件
                await next();
                ms = new Date().getTime() - start;
                this.netResponse(ctx, ms);//记录响应日志
            } catch (error: any) {
                ms = new Date().getTime() - start;
                this.netError(ctx, error, ms); //记录异常日志
                ctx.throw();
            }
        }
    };

    abstract netResponse(ctx: any, time: number): void;

    abstract netError(ctx: any, error: any, time: number): void;

}
