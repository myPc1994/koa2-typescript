import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";

/**
 * 用户
 */
class User extends BaseDb {
    protected tableName: string = "User";
    protected tableSchema: IKeyValue = {
        userName: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        describe: {type: String},
        createTime: {type: String, default: () => new Date().getTime()},
    };

}

export const UserCtrl = new User();