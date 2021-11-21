import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";
import {v1} from 'uuid';
import {IReturnInfo, ResponseBeautifier, ResponseInfo} from "../../../utils/ResponseBeautifier";
import {UserRoleCtrl} from "./UserRoleCtrl";

/**
 * 角色
 */
class Role extends BaseDb {
    protected tableName: string = "Role";
    protected tableSchema: IKeyValue = {
        roleId: {type: String, required: true, unique: true, default: () => v1()},
        name: {type: String, required: true, unique: true},
        createTime: {type: String, default: () => new Date().getTime()},
    };

    public async addRole(name: string): Promise<IReturnInfo> {
        const userInfo = await this.findOne({name});
        if (userInfo) {
            return {...ResponseInfo.dataError, message: "该角色已存在!"};
        }
        const data: IKeyValue = await RoleCtrl.save({name});
        return {...ResponseInfo.success, data};
    }

    public async deleteRole(roleId: string): Promise<IReturnInfo> {
        const data = await this.deleteOne({roleId});
        if (data.deletedCount === 0) {
            return {...ResponseInfo.dataError, message: "删除个数为0,删除失败!"};
        }
        await UserRoleCtrl.deleteMany({roleId});// 同时需要删除用户角色表的关系
        return ResponseInfo.success;
    }
}

export const RoleCtrl = new Role();