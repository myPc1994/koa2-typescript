import path from 'path';
import fs from 'fs';
import axios from 'axios';
const publicPath = path.resolve(__dirname, '../../public/');

/**
 * 文件处理工具类
 */
export class FileUtil {
    // 多层级创建文件夹
    public static mkdirs(dirname: string, callback: any) {
        fs.exists(dirname, function (exists) {
            if (exists) {
                callback();
            } else {
                FileUtil.mkdirs(path.dirname(dirname), function () {
                    fs.mkdir(dirname, callback);
                });
            }
        });
    }

    // 删除文件夹，及其文件
    public static rmdir(path: string) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                const curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    FileUtil.rmdir(curPath); // 递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); // 删除文件
                }
            });
            fs.rmdirSync(path);
        }
    }

    // 移除当前目录下的文件
    public static removeFile(path: string) {
        if (fs.existsSync(path)) {
            FileUtil.rmdir(path);
            fs.mkdirSync(path);
        }
    }

    //下载文件
    public static downloadFile(url: string, filePath: string) {
        return new Promise((resolve, reject) => {
            console.log(url, filePath);
            if (fs.existsSync(filePath)) {
                return resolve(null);
            }
            FileUtil.mkdirs(path.resolve(filePath, "../"), async () => {
                const writer = fs.createWriteStream(filePath);
                // console.log("本地文件路径",filePath);
                axios({url, method: "GET", responseType: "stream"}).then((response: any) => {
                    response.data.pipe(writer);
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                }).catch((error: any) => {
                    reject(error.message);
                });
            })
        });
    }

}
