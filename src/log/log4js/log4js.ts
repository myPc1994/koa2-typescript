const log4js = require('log4js');
// pm2 写入失败问题：https://cyyjs.github.io/2017/11/15/I4m5wYG9ovY6L9Va/
log4js.configure({
    appenders: {
        systemInfo:{   // 文件形式打印日志
            type: "dateFile",
            filename: './logs/system/systemInfo',// 写入日志文件的路径
            alwaysIncludePattern: true,// （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            // compress: true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "yyyy-MM-dd.log",// （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8',// default "utf-8"，文件的编码
            maxLogSize: 1024 * 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },// 系统消息
        netError: {   // 文件形式打印日志
            type: "dateFile",
            filename: './logs/net/netError',// 写入日志文件的路径
            alwaysIncludePattern: true,// （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            // compress: true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "yyyy-MM-dd.log",// （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8',// default "utf-8"，文件的编码
            maxLogSize: 1024 * 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },// 网络错误日志
        netResponse: {   // 文件形式打印日志
            type: "dateFile",
            filename: './logs/net/netResponse',// 写入日志文件的路径
            alwaysIncludePattern: true,// （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            // compress: true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "yyyy-MM-dd.log",// （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8',// default "utf-8"，文件的编码
            maxLogSize: 1024 * 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },// 网络日志
        console: {   // 控制台打印日志
            type: 'console'
        }
    },
    categories: {
        systemInfo: {
            appenders: ['systemInfo'],
            level: log4js.levels.ALL
        },
        netError: {
            appenders: ['netError'],
            level: log4js.levels.ERROR
        },
        netResponse: {
            appenders: ['netResponse'],
            level: log4js.levels.ALL
        },
        default: {   // 默认使用打印日志的方式
            appenders: ['console'],  // 指定为上面定义的appender，如果不指定，无法写入
            level: log4js.levels.ALL             // 打印日志的级别
        }
    },
    pm2: true,// （布尔值）（可选） -如果你使用的是运行你的应用程序此设置为true PM2，否则日志将无法正常工作（你还需要安装PM2对讲为PM2模块：pm2 install pm2-intercom）
    pm2InstanceVar: 'INSTANCE_ID'
});

module.exports = log4js;
