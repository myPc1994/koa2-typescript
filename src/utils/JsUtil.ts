import {ICpcVersion, IKeyValue} from "../core/CpcInterface";

export class JsUtil {
    public static versionCheck(addV: ICpcVersion, dbV: ICpcVersion) {
        if (addV.version_1 < dbV.version_1) {
            return false;
        }
        if (addV.version_1 > dbV.version_1) {
            return true;
        }
        // 到此version_1一定相等
        if (addV.version_2 < dbV.version_2) {
            return false;
        }
        if (addV.version_2 > dbV.version_2) {
            return true;
        }
        // 到此version_2一定相等
        if (addV.version_3 <= dbV.version_3) {
            return false;
        }
        if (addV.version_3 > dbV.version_3) {
            return true;
        }
    }


    public static timeObj2ArrSort(obj: IKeyValue) {
        const arr = [];
        for (let key of Object.keys(obj)) {
            arr.push({
                time: key,
                data: obj[key],
            })
        }
        const divisionTrend = arr.sort((item1: any, item2: any) => {
            return item1.time > item2.time ? 1 : -1;
        })
        return divisionTrend;
    }


    public static getType(name: string) {
        return name.substring(name.lastIndexOf("."), name.length);
    }

    public static isEmpty(arr: any[]) {
        if (arr.length === 0) {
            return false;
        }
        for (const v of arr) {
            if (!v && typeof v !== "number") {
                return false;
            }
        }
        return true;
    }
}
