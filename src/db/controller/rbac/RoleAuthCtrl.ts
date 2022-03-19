import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";

/**
 * 角色-资源
 */
class RoleResources extends BaseDb {
    public getRolesByAuth(authId: string) {
        return this.model.aggregate([
            {
                $match: {authId}
            },
            {
                $lookup:// 连表关键词，类似mysql中的left join
                    {
                        localField: "roleId",// 本表需要关联的字段
                        from: "Role",// 需要连接的表名
                        foreignField: "roleId",// 被连接表需要关联的字段
                        as: "roles"// 查询出的结果集别名
                    }
            },
            {
                $project: {authId: 1, _id: 0, "roles.name": 1, "roles.roleId": 1, "roles.createTime": 1}
            },
        ]);
    }

    public getAuthsByRole(roleId: string) {
        return this.model.aggregate([
            {
                $match: {roleId}
            },
            {
                $lookup:// 连表关键词，类似mysql中的left join
                    {
                        localField: "authId",// 本表需要关联的字段
                        from: "Auth",// 需要连接的表名
                        foreignField: "authId",// 被连接表需要关联的字段
                        as: "auths"// 查询出的结果集别名
                    }
            },
            {
                $project: {
                    roleId: 1,
                    _id: 0,
                    "auths.authId": 1,
                    "auths.type": 1,
                    "auths.subType": 1,
                    "auths.name": 1,
                    "auths.createTime": 1,
                }
            },
        ]);
    }

    protected createModelEnd(schema: Schema) {
        schema.index({roleId: 1, resourceId: 1}, {unique: true});
    }
}

const tableSchema: IKeyValue = {
    roleId: {type: String, required: true},
    authId: {type: String, required: true},
};
export const RoleAuthCtrl = new RoleResources("RoleAuth", tableSchema);