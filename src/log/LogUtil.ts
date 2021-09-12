import {ILogUtil} from "./ILogUtil";

let log: ILogUtil | any = null;
if ((global as any)._envConfig.env === 'development') {
    const LogConsole = require("./console/LogConsole").LogConsole;
    log = new LogConsole();
} else {
    if ((global as any)._envConfig.log.type === "file") {
        const Log4jsUtil = require("./log4js/Log4jsUtil").Log4jsUtil;
        log = new Log4jsUtil();
    } else {
        const LogDB = require("./logDB/LogDB").LogDB;
        log = new LogDB();
    }
}
export const logUtil: ILogUtil = log;

