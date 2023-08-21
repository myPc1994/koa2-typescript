const pkg = require("./package.json");
const path = require("path");
module.exports = {
    apps: [
        {
            "name": pkg.name,//应用程序名称
            "script": "bin/www",//应用程序的脚本路径
            "cwd": "./",//根目录
            "instances": 1,//应用启动实例个数，仅在cluster模式有效，默认为fork；
            "exec_mode": "cluster",//应用程序启动模式，支持fork和cluster模式，默认是fork；
            error_file: path.join(__dirname, "logs", "error.log"), // 错误日志文件路径
            out_file: path.join(__dirname, "logs", "out.log"),
            "max_restarts": 10,
            "instance_var": "INSTANCE_ID",
            "merge_logs": true,
            log_date_format: "YYYY-MM-DD_HH-mm-ss",
            max_memory_restart: "1G"
        }
    ]

}
