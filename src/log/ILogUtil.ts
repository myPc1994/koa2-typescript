import {Context, Next} from "koa";
import Moment from 'moment';
import {ResponseBeautifier} from "../tools/ResponseBeautifier";

export enum ELevel {
    error = "error",
    info = "info",
    warn = "warn",
}

// 日志抽象类
export abstract class ILogUtil {

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
            this.netBefore(ctx);
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
                ResponseBeautifier.responseByStatus(ctx, error.status || 500, error.message, error);
            }
        }
    };


    public netBefore(ctx: Context): void {
        let {originalUrl, method} = ctx;
        console.log(Moment().format('YYYY-MM-DD HH:mm:ss'), " <-- ", method, originalUrl);
    }

    public abstract netResponse(ctx: Context, time: number): void;

    public abstract netError(ctx: Context, error: any, time: number): void;

}
