import {ELevel, ILogUtil} from "../../core/ILogUtil";

export class LogDB extends ILogUtil {

    netError(ctx: any, error: any, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        info.time = time;
        let infoStr = JSON.stringify(info);
        const errorInfo = this.formatError(error, infoStr)
        //    自定义存储到数据库中
    }

    netResponse(ctx: any, time: number): void {
        const info: any = this.getClinetInfo(ctx);
        //    自定义存储到数据库中
    }

    log(level: ELevel, msg: string): void {
        //    自定义存储到数据库中
    }


}