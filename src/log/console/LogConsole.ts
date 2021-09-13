import logger from 'koa-logger';
import Moment from 'moment';
import {ELevel, ILogUtil} from "../ILogUtil";
import {Context} from 'koa';
export class LogConsole extends ILogUtil {
    public net() {
        return logger((str: string, args: any) => {    // 使用日志中间件
            console.log(Moment().format('YYYY-MM-DD HH:MM:SS') + str);
        });
    }

    public netError(ctx: Context, error: any, time: number): void {
    }

    public netResponse(ctx: Context, time: number): void {
    }

    public log(level: ELevel, msg: string): void {
        (console as any)[level](msg);
    }


}
