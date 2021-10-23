
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";
/**
 * 资源
 */
export class Resources extends BaseDb {
    protected tableName: string="Resources";
    protected tableSchema: IKeyValue = {
        name: {type: String, required: true},
        describe: {type: String},
        createTime: {type: String, default: () => new Date().getTime()},
    };

}
export const ResourcesCtrl = new Resources();
