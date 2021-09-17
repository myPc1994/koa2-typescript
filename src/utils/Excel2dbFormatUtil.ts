import {JsUtil} from "./JsUtil";
import xlsx from "node-xlsx";
import moment from 'moment';

export class Excel2dbFormatUtil {
    public static nucleate(path: string) {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index <= 0) {
                    continue;
                }
                const item = table.data[index];
                if(JsUtil.isEmpty(item,4)){
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "allPeople": item[1],
                        "everyDay": item[2],
                        "county": item[3]
                    })
                }
            }
        }
        return result;
    }
    public static moPai(path: string) {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index <= 0) {
                    continue;
                }
                const item = table.data[index];
                if(JsUtil.isEmpty(item,15)){
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "county": item[1],
                        "receivingNum": item[2],
                        "haveCheck": item[3],
                        "notCheck": item[4],
                        "verifyNum": item[5],
                        "invalidCombin": item[6],
                        "duplicateData": item[7],
                        "notToAffectedArea": item[8],
                        "infoNotComplete": item[9],
                        "outProvinceNum": item[10],
                        "inProvinceNum": item[11],
                        "highRisk": item[12],
                        "middleRisk": item[13],
                        "lowRisk": item[14],
                    })
                }
            }
        }
        return result;
    }
    public static keyArea(path: string) {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index <= 0) {
                    continue;
                }
                const item = table.data[index];
                if(JsUtil.isEmpty(item,6)){
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "county": item[1],
                        "receivingNum": item[2],
                        "haveCheck": item[3],
                        "notCheck": item[4],
                        "notCheck24H": item[5],
                    })
                }
            }
        }
        return result;
    }


}
