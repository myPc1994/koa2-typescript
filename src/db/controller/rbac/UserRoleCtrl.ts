import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";

/**
 * 角色-用户
 */
class RoleUser extends BaseDb {
    protected tableName: string = "RoleUser";
    protected tableSchema: IKeyValue = {
        roleId: {type: Schema.Types.ObjectId, ref: 'Role'},
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
    };

}

export const UserRoleCtrl = new RoleUser();