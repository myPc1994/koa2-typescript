import {BaseTable} from "../../BaseTable";
import {table_user_role} from "./Table_user_role";
import {database} from "../../index";
import {ResponseBeautifier} from "../../../utils/ResponseBeautifier";
import {EResponseCode, IResponse} from "../../../types/types";
import {ITableRole, tableRole} from "./TableRole";
import {ITableResource, tableResource} from "./TableResource";
import {table_role_resource} from "./Table_role_resource";
// 用户表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
    "account": "TEXT NOT NULL",//账号
    "password": "TEXT NOT NULL",//密码
    "name": "TEXT",//名称
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
            id: "admin",
            account: "admin",
            password: "admin",
            name: "超级管理员",
            description: "权限最高拥有者",
        })
    }

    public findByLeftJoin(name?: string, page = 0, size = 10) {
        // const where = `where name like '%${name}%'`;
        // const countRes: any = this.prepare(this._count(where, "id")).get();
        // if (!countRes || countRes.count === 0) {
        //     return {
        //         total: 0,
        //         data: []
        //     }
        // }
        // const sql = `SELECT *, COALESCE((SELECT '[' || GROUP_CONCAT(JSON_OBJECT('id',id,'name',name)) || ']'
        //                         FROM ${tableRole.name} AS t_role
        //                         LEFT JOIN ${table_user_role.name} AS t_user_role ON t_role.id = t_user_role.roleId
        //                         WHERE t_user_role.userId=t_user.id AND t_role.id IS NOT NULL
        //                         ),'[]') AS roles
        //                     FROM ${this.name} AS t_user
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

    public getRoles(id: string) {
        const sql = `SELECT t_role.* FROM ${tableRole.name} AS t_role
                            INNER JOIN ${table_user_role.name} AS t_user_role ON t_user_role.userId='${id}' and t_role.id =t_user_role.roleId`;
       return  database.prepare(sql).all() as ITableRole[];
    }
    public getResources(id: string) {
        const sql = `select t_resource.* from ${tableResource.name} AS t_resource
                            INNER JOIN ${table_role_resource.name} AS t_role_resource on t_resource.id =t_role_resource.resourceId
                            INNER JOIN ${table_user_role.name} AS t_user_role on t_user_role.userId='${id}' AND t_role_resource.roleId=t_user_role.roleId
                            `;
        return  database.prepare(sql).all() as ITableResource[];
    }

    public bindRoles(id: string, roles: string[]) {
        database.transaction(() => {
            table_user_role.delete({userId: id}, "WHERE userId=:userId");
            table_user_role.inserts(roles.map(roleId => ({userId: id, roleId})))
        })()
    }

    public delete2(id: string) {
        return database.transaction(() => {
            this.delete({id}, "WHERE id=:id");
            table_user_role.delete({userId: id}, "WHERE userId=:userId");
        })();
    }

}

export const tableUser = new Table("tableUser");
