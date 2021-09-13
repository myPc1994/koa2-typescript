import {ELevel, ILogUtil} from "../ILogUtil";
import {Context} from 'koa';
var log4js = require('./log4js');
var systemInfo = log4js.getLogger('systemInfo');
var netError = log4js.getLogger('netError');
var netResponse = log4js.getLogger('netResponse');

export class Log4jsUtil extends ILogUtil {
    public log(level: ELevel, msg: string) {
        systemInfo[level](msg);
    }

    public netError(ctx: Context, error: any, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        info.time = time;
        let infoStr = JSON.stringify(info);
        netError.error(this.formatError(error, infoStr))
    }

    public netResponse(ctx: Context, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        info.time = time;
        let errStr = JSON.stringify(info);
        console.log(info, ctx)
        netResponse.info(errStr)
    }


}
