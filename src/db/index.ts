import {createConnection, Connection} from 'mongoose';
import {logUtil} from "../log/LogUtil";
import {ELevel} from "../log/ILogUtil";

export class DbUtil {
    private mongooseInstance: Connection;
    private uri: string;
    private openCbArr: Function[] = [];// 需要等待数据连接成功后执行的函数集合
    constructor(config: any) {
        let {user, pass, host, port, database, option} = config;
        let uri: string;
        if (user && pass) {
            // mongodb://user:pass@localhost:port/database
            // mongodb://127.0.0.1:27017/admin?compressors=disabled&gssapiServiceName=mongodb
            uri = `mongodb://${user}:${pass}@${host}:${port}/${database}`;
        } else {
            uri = `mongodb://${host}:${port}/${database}`;
        }
        this.uri = uri;
        this.mongooseInstance = createConnection(uri, option);
        this.mongooseInstance.on('connected', (err) => {
            if (err) {
                logUtil.log(ELevel.error, '连接数据库失败:' + uri + err);
                console.error("连接数据库失败", uri, err);
            } else {
                console.log("连接数据库成功");
                logUtil.log(ELevel.info, '连接数据库成功:' + uri)
                this.runCallBack();
            }
        });
    }

    public onConnected(cb: Function) {
        if (this.mongooseInstance) {
            cb(this.mongooseInstance);
        } else {
            this.openCbArr.push(cb);
        }
    }

    private runCallBack() {
        for (let cb of this.openCbArr) {
            cb(this.mongooseInstance);
        }
        this.openCbArr = [];
    }
}
