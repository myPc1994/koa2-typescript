import {ICpcVersion, IKeyValue} from "../core/CpcInterface";
import moment from 'moment';

/**
 * js工具类
 */
export class JsUtil {
    /**
     * 获取文件后缀
     * @param {string} path 路径/文件名
     * @returns {any}
     */
    public static getType(path: string) {
        return path.substring(path.lastIndexOf("."), path.length);
    }

    /**
     * 字符串日期格式化
     * @param {string} str
     * @returns {moment.Moment}
     */
    public static moment(str: string) {
        if (str.indexOf("/")) {
            return moment(str, "YYYY/MM/DD HH:mm", true);
        } else {
            return moment(str, true);
        }
    }

    /**
     * 根据唯一值field判断数据1中和数组2的内容差异性
     * @param arr1 数组1
     * @param arr2 数组2
     * @param fields 用于判断唯一的字段名称数组
     * @returns {{
     *              meet: Array, 数组1和数组2中都存在
     *              noMeet: Array, 只有数组1中存在
     *              noMeet2:Array  只有数组2中存在
     *           }}
     */
    public static splitArrayMeet(arr1: any, arr2: any, fields: string[]) {
        const meet = [];
        const noMeet = [];
        let isMeet;
        for (const item of arr1) {
            isMeet = false;
            for (const v of arr2) {
                let isMeet2 = true;
                for (const field of fields) {
                    if (item[field] !== v[field]) {
                        isMeet2 = false;
                        break;
                    }
                }
                if (isMeet2) {
                    isMeet = true;
                    break;
                }
            }
            if (isMeet) {
                meet.push(item);
            } else {
                noMeet.push(item);
            }
        }
        const noMeet2 = [];
        for (const item of arr2) {
            isMeet = false;
            for (const v of meet) {
                let isMeet2 = true;
                for (const field of fields) {
                    if (item[field] !== v[field]) {
                        isMeet2 = false;
                        break;
                    }
                }
                if (isMeet2) {
                    isMeet = true;
                    break;
                }
            }
            if (!isMeet) {
                noMeet2.push(item);
            }
        }
        return {meet, noMeet, noMeet2};
    }
}
