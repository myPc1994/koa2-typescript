import logger from 'koa-logger';
import Moment from 'moment';
import {ELevel, ILogUtil} from "../ILogUtil";

export class LogConsole extends ILogUtil {
    net() {
        return logger((str: string, args: any) => {    // 使用日志中间件
            console.log(Moment().format('YYYY-MM-DD HH:MM:SS') + str);
        });
    }

    netError(ctx: any, error: any, time: number): void {
    }

    netResponse(ctx: any, time: number): void {
    }

    log(level: ELevel, msg: string): void {
        (console as any)[level](msg);
    }


}