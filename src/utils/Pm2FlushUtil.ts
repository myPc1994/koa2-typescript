import {ELevel} from "../log/ILogUtil";
import {logUtil} from "../log/LogUtil";

const exec = require('child_process').exec;
const defaultTime = 1000 * 60 * 60 * 24 * 15;// 默认15天清理一次
/**
 * 由于pm2自己会记录日志，时间长了，会导致日志文件太大，占用太多空间，所有进行pm2日志清除
 */
export class Pm2FlushUtil {

    public static start(delay = defaultTime): void {
        if (Pm2FlushUtil.timer) {
            return
        }
        Pm2FlushUtil.timer = setInterval(Pm2FlushUtil.flush, delay)
    }

    public static flush() {
        logUtil.log(ELevel.info, "清除pm2日志");
        exec('pm2 flush', function (error: any) {
            logUtil.log(ELevel.error, error);
        });
    }

    private static timer: any = null;

}
