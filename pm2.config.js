module.exports = {
    apps: [
        {
            "name": "cpc-node-koa2-base",//应用程序名称
            "script": "bin/www",//应用程序的脚本路径
            "cwd":"./",//根目录
            "instances": 1,//应用启动实例个数，仅在cluster模式有效，默认为fork；
            "exec_mode": "cluster",//应用程序启动模式，支持fork和cluster模式，默认是fork；
            "error_file": "/dev/null",//不要错误日志
            "out_file": "/dev/null",//不要日志文件
            "max_restarts": 10,
            "instance_var": "INSTANCE_ID"
        }
    ]
}