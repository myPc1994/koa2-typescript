import {Context} from "koa";
import {ELevel, ILogUtil} from "../ILogUtil";

export class LogDB extends ILogUtil {

    public netError(ctx: Context, error: any, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        info.time = time;
        let infoStr = JSON.stringify(info);
        const errorInfo = this.formatError(error, infoStr)
        //    自定义存储到数据库中
    }

    public netResponse(ctx: Context, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        //    自定义存储到数据库中
    }

    public log(level: ELevel, msg: string): void {
        //    自定义存储到数据库中
    }


}
