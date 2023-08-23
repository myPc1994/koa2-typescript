import {BaseTable} from "../../BaseTable";
import {table_user_role} from "./Table_user_role";
import {tableRole} from "./TableRole";
import {viewPermission} from "../../views/ViewPermission";
import {table_role_resource} from "./Table_role_resource";
// 用户表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
    "account":"TEXT NOT NULL",//账号
    "password":"TEXT NOT NULL",//密码
    "name":"TEXT",//名称
    "description": "TEXT ",// 描述
}
export type ITableUser = {
    [key in keyof typeof table]?: any
}
class Table extends BaseTable<ITableUser> {
    constructor(tableName: string) {
        super(tableName, table);
        // 如果不存在超级管理员，就插入一个
       this.insertOrUpdate({
           id:"admin",
           account:"admin",
           password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",//admin
           name:"超级管理员",
           description:"权限最高拥有者",
       })
    }

    public findByLeftJoin(name?:string, page = 0, size = 10) {
        // const where = `where name like '%${name}%'`;
        // const countRes: any = this.prepare(this._count(where, "id")).get();
        // if (!countRes || countRes.count === 0) {
        //     return {
        //         total: 0,
        //         data: []
        //     }
        // }
        // const sql = `SELECT *, COALESCE((SELECT '[' || GROUP_CONCAT(JSON_OBJECT('id',id,'name',name)) || ']'
        //                         FROM ${tableRole.tableName} AS t_role
        //                         LEFT JOIN ${table_user_role.tableName} AS t_user_role ON t_role.id = t_user_role.roleId
        //                         WHERE t_user_role.userId=t_user.id AND t_role.id IS NOT NULL
        //                         ),'[]') AS roles
        //                     FROM ${this.tableName} AS t_user
        //                     ${where}
        //                     ORDER BY updateTime DESC LIMIT ? OFFSET ?
        //            `
        // const data: any[] = this.prepare(sql).all(size, page * size);
        // data.forEach(item => item.roles = JSON.parse(item.roles))
        // return {
        //     data: data,
        //     total: countRes.count
        // }
    }

    public createUser(data: ITableUser){
        // this.transaction(() => {
        //     const allowData = this.allowFields(data);
        //     this.insert(allowData)
        //     const roles = (data as any).roles;
        //     if (roles && roles.length > 0) {
        //         const items = roles.map((roleId: string) => ({
        //             "userId": data.id,
        //             "roleId": roleId,
        //         }))
        //         table_user_role.inserts(items)
        //     }
        // })
    }
    public updateUser(data: ITableUser){
        // this.transaction(() => {
        //     const allowData = this.allowFields(data, ["id", "shopId"], true);
        //     this.update({id: data.id}, allowData);
        //     //超级管理员拥有所有权限，不需要配置这个
        //     if(data.id === "admin"){
        //         return;
        //     }
        //     const roles = (data as any).roles;
        //     table_user_role.delete({userId: data.id})
        //     if (roles && roles.length > 0) {
        //         const items = roles.map((roleId: string) => ({
        //             "userId": data.id,
        //             "roleId": roleId,
        //         }))
        //         table_user_role.inserts(items)
        //     }
        // })
    }
    public delete2(id:string){
        // this.transaction(()=>{
        //     this.delete({id});
        //     table_user_role.delete({userId:id});
        // })
    }

    public findPermissions(where:string|ITableUser){
        // const sql = `SELECT DISTINCT permission.*
        //               FROM ${viewPermission.viewName} AS permission
        //               LEFT  JOIN ${table_role_resource.tableName} AS roleResource ON permission.id = roleResource.resourceId
        //               LEFT  JOIN ${table_user_role.tableName} AS userRole ON userRole.roleId = roleResource.roleId
        //               LEFT  JOIN ${this.tableName} AS user ON user.id = userRole.userId
        //               ${this._where(where,"user.")}
        //            `
        // return this.prepare(sql).all();
    }

}

export const tableUser = new Table("tableUser");
