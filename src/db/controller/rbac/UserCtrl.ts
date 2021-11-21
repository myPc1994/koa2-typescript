import {Schema} from 'mongoose';
import {BaseDb} from "../../BaseDb";
import {IKeyValue} from "../../../core/CpcInterface";
import {v1} from 'uuid';
import {IReturnInfo, ResponseBeautifier, ResponseInfo} from "../../../utils/ResponseBeautifier";
import {CryptoUtil} from "../../../utils/CryptoUtil";
import {UserRoleCtrl} from "./UserRoleCtrl";

/**
 * 用户
 */
class User extends BaseDb {
    protected tableName: string = "User";
    protected tableSchema: IKeyValue = {
        userId: {type: String, required: true, unique: true, default: () => v1()},// 唯一标识
        userName: {type: String, required: true, unique: true},// 用户名唯一
        password: {type: String, required: true},// 密码
        name: {type: String},// 名称
        createTime: {type: String, default: () => new Date().getTime()},
    };

    public async addUser(userName: string, password: string): Promise<IReturnInfo> {
        const userInfo = await this.findOne({userName});
        if (userInfo) {
            return {...ResponseInfo.dataError, message: "该用户名已存在!"};
        }
        const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
        const res: IKeyValue = await this.save({userName, password: saltPassword});
        return {...ResponseInfo.success, data: {userId: res.userId, userName: res.userName,createTime:res.createTime}};
    }

    public async deleteUser(userId: string): Promise<IReturnInfo> {
        const data = await this.deleteOne({userId});
        if (data.deletedCount === 0) {
            return {...ResponseInfo.dataError, message: "删除个数为0,删除失败!"};
        }
        await UserRoleCtrl.deleteMany({userId});// 同时需要删除用户角色表的关系
        return ResponseInfo.success;
    }

}

export const UserCtrl = new User();