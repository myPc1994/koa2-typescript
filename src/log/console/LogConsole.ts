import Moment from 'moment';
import {ELevel, ILogUtil} from "../ILogUtil";
import {Context} from 'koa';

export class LogConsole extends ILogUtil {
    public netError(ctx: Context, error: any, time: number): void {
        console.error("请求错误信息", error);
    }

    public netResponse(ctx: Context, time: number): void {
        let {originalUrl, method, status} = ctx;
        console.log(Moment().format('YYYY-MM-DD HH:mm:ss'), " --> ", method, originalUrl, status, `${time}ms`);
    }

    public log(level: ELevel, msg: string): void {
        (console as any)[level](msg);
    }


}
