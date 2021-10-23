import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";
/**
 * 角色
 */
class Role extends BaseDb {
    protected tableName: string = "Role";
    protected tableSchema: IKeyValue = {
        name: {type: String, required: true, unique: true},
        describe: {type: String},
        createTime: {type: String, default: () => new Date().getTime()},
    };

}

export const RoleCtrl = new Role();