import {ILogUtil} from "./ILogUtil";

let log: ILogUtil | any;
const _global: any = global;
if (_global._envConfig.env === 'development') {
    const LogConsole = require("./console/LogConsole").LogConsole;
    log = new LogConsole();
} else {
    if (_global._envConfig.log && _global._envConfig.log.type === "db") {
        const LogDB = require("./logDB/LogDB").LogDB;
        log = new LogDB();
    } else {
        const Log4jsUtil = require("./log4js/Log4jsUtil").Log4jsUtil;
        log = new Log4jsUtil();
    }
}
export const logUtil: ILogUtil = log;

