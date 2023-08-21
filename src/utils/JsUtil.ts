import dayjs from 'dayjs';

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
        if (str.indexOf("/") !== -1) {
            return dayjs(str, "YYYY/MM/DD HH:mm", true);
        } else {
            return dayjs(str);
        }
    }

    /**
     * 过滤掉数组中的相同数据
     * @param {any[]} arr 原始数组
     * @param {string[]} fields 唯一标识的的字段数组
     * @returns {any[]}
     */
    public static nodupArray(arr: any[], fields: string[]): any[] {
        const cacheObj: any = {};
        return arr.filter(item => {
            let uuid = "";
            for (const field of fields) {
                uuid += item[field];
            }
            if (cacheObj[uuid] === true) {
                return false
            } else {
                cacheObj[uuid] = true;
                return true
            }
        })
    }


    public static getQuery(url?: string) {
        const result: any = {}
        if (!url) {
            return result;
        }
        const str = url.substring(url.indexOf('?') + 1)
        const arr = str.split('&')
        for (let i = 0; i < arr.length; i++) {
            // item的两个元素分别为参数名和参数值
            const item = arr[i].split('=')
            result[item[0]] = decodeURIComponent(item[1]);
        }
        return result
    }

    public static findIndex(arr: any[], field: string, value: any) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item[field] === value) {
                return i;
            }
        }
        return -1;
    }

    public static getPrice(price: number, factor: number, limitLower: number, limitUpper: number) {
        price = price + factor
        price = Math.max(price, limitLower);
        price = Math.min(price, limitUpper);
        return price;
    }
    public static sleep(delay = 800) {
        return new Promise(resolve => {
           setTimeout(resolve, delay)
        })
    }
}
