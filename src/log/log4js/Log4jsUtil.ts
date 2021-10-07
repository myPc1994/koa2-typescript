import {ELevel, ILogUtil} from "../ILogUtil";
import {Context} from 'koa';
import {NetUtil} from "../../utils/NetUtil";

const log4js = require('./log4js');
const systemInfo = log4js.getLogger('systemInfo');
const netError_ = log4js.getLogger('netError');
const netResponse_ = log4js.getLogger('netResponse');

export class Log4jsUtil extends ILogUtil {

    public log(level: ELevel, msg: string) {
        systemInfo[level](msg);
    }

    public netError(ctx: Context, error: any, time: number): void {
        const info: any = NetUtil.getClinetInfo(ctx);
        info.time = time;
        let infoStr = JSON.stringify(info);
        netError_.error(this.formatError(error, infoStr))
    }

    public netResponse(ctx: Context, time: number): void {
        const info: any = NetUtil.getClinetInfo(ctx);
        info.time = time;
        let errStr = JSON.stringify(info);
        netResponse_.info(errStr)
    }


}
