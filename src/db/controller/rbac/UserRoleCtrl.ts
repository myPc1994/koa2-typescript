import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";

/**
 * 角色-用户
 */
class UserRole extends BaseDb {
    protected tableName: string = "UserRole";
    protected tableSchema: IKeyValue = {
        userId: {type: String, required: true},
        roleId: {type: String, required: true},
    };

    public  getRolesByUser(userId: string) {
        return this.model.aggregate([
            {
                $match: {userId}
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
                $project: {userId: 1, _id: 0, "roles.name": 1, "roles.roleId": 1, "roles.createTime": 1}
            },
        ]);
    }

    public  getUsersByRole(roleId: string) {
        return this.model.aggregate([
            {
                $match: {roleId}
            },
            {
                $lookup:// 连表关键词，类似mysql中的left join
                    {
                        localField: "userId",// 本表需要关联的字段
                        from: "User",// 需要连接的表名
                        foreignField: "userId",// 被连接表需要关联的字段
                        as: "users"// 查询出的结果集别名
                    }
            },
            {
                $project: {roleId: 1, _id: 0, "users.userId": 1, "users.account": 1, "users.createTime": 1}
            },
        ]);
    }

    protected createModelEnd(schema: Schema) {
        schema.index({roleId: 1, userId: 1}, {unique: true});
    }

}

export const UserRoleCtrl = new UserRole();