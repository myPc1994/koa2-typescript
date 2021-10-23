import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";

/**
 * 角色-资源
 */
class RoleResources extends BaseDb {
    protected tableName: string = "RoleResources";
    protected tableSchema: IKeyValue = {
        roleId: {  type: Schema.Types.ObjectId, ref: 'Role'},
        resourceId: {  type: Schema.Types.ObjectId, ref: 'Resources'},
    };

}

export const RoleResourcesCtrl = new RoleResources();