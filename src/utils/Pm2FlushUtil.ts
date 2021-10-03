import {ELevel} from "../log/ILogUtil";
import {logUtil} from "../log/LogUtil";
import schedule from 'node-schedule';

const exec = require('child_process').exec;
/**
 * 由于pm2自己会记录日志，时间长了，会导致日志文件太大，占用太多空间，所有进行pm2日志清除
 */
export class Pm2FlushUtil {

    public static start(): void {
        if (Pm2FlushUtil.timer) {
            return
        }
        // 每月1号清理一次
        schedule.scheduleJob('0 0 0 1 * *',Pm2FlushUtil.flush);
    }

    public static flush() {
        logUtil.log(ELevel.info, "清除pm2日志");
        exec('pm2 flush', function (error: any) {
            logUtil.log(ELevel.error, error);
        });
    }

    private static timer: any = null;

}
