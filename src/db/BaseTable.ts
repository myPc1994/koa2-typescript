import {database} from "./index";
import {IKeyValue} from "../types/types";

/**
 * 更新表格
 * @param tableName 表明
 * @param table 表的字段信息
 * @param other 其它sql语句,例如组合的主键定义等
 */
function _updateTable(tableName: string, table: IKeyValue<string>, other?: string) {
    const contentArr = Object.entries(table).map(kv => kv.join(" "));
    if (other) {
        contentArr.push(other);
    }
    const content = contentArr.join(",");
    database.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${content})`);
    // 检查表的字段是否需要更新
    const checkColumnsQuery = `PRAGMA table_info(${tableName});`;
    const existingColumns: any[] = database.prepare(checkColumnsQuery).all();
    const missingkeys = Object.keys(table).filter(name => {
        return !existingColumns.some(existingColumn => existingColumn.name === name);
    });
    if (missingkeys.length > 0) {
        // 添加缺少的字段
        missingkeys.forEach(name => {
            const addColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN ${name} ${table[name]};`;
            database.exec(addColumnQuery);
            console.log(tableName, `已添加字段 ${name}`);
        });
    } else {
        // console.log(tableName, '表字段已经是最新的，无需更新');
    }
}

type TypeAction = IKeyValue<"=" | "<>" | ">" | "<" | ">=" | "<=" | "IN" | "NOT IN" | "LIKE">

export abstract class BaseTable<T extends IKeyValue<any>> {
    public tableName: string;//表名
    protected allFields: string[] = [];//表的所有字段

    constructor(tableName: string, fieldInfo: T, other?: string) {
        this.tableName = tableName;
        this.allFields = Object.keys(fieldInfo);
        _updateTable(tableName, fieldInfo, other);
    }

    /**
     * 允许字段的过滤,如果存在updateTime，同时更新时间戳
     * @param data 需要过滤的数据
     * @param fields 允许的字段，不传，数据库表字段存在的全部都允许
     * @param isReverse 是否反向过滤
     */
    public allowFields(data: T, fields?: string[], isReverse = false, allowValue = [0, ""]): T {
        if (!fields) {
            fields = this.allFields
        } else if (isReverse) {
            fields = this.allFields.filter(item => fields?.indexOf(item) === -1);
        }
        const result: any = {};
        for (const field of fields) {
            const v = data[field];
            if (v || allowValue.indexOf(v) !== -1) {
                result[field] = data[field];
            }
        }
        return result;
    }

    public getFields(noField?: string[]) {
        if (!noField) {
            return this.allFields;
        }
        return this.allFields.filter(field => {
            return noField.indexOf(field) === -1;
        })
    }

    /**
     * 将对象的条件转换成sql语句
     * @param where 如果为T：  {id:1,name:2} --->  id=1 and name=2
     *                   T[]：[{id:1,name:2},{id:2,name:3}] --->  id=1 and name=2 or id=2 and name=3
     * @param action 不写的话默认使用=关联
     * @param ASName 带前缀别名   例如：ASName="A"需要转换为 A.id=1 and A.name=2
     */
    public parseWhere(where?: T | T[], action?: TypeAction | TypeAction[], ASName = "") {
        if (!where) {
            return ""
        }
        let result = "";
        if (Array.isArray(where)) {
            if (!Array.isArray(action)) {
                throw new Error("where是个数组，action也必须是个数组!");
            }
            const subAction = action || [];
            result = where.map((item, index) => this._parseWhere(item, subAction[index], ASName)).join("OR");
        } else {
            result =  this._parseWhere(where, action as TypeAction, ASName);
        }
        if(!result){
            return "";
        }
        return " WHERE " + result;
    }

    private _parseWhere(where: T, action: TypeAction = {}, ASName = "") {
        where = this.allowFields(where,undefined,undefined,[0]);
        //TODO 后续需要安全考虑
        // const stmt = db.prepare('SELECT * FROM users WHERE username = :username');
        // const user = stmt.get({ username: 'example_user' });
        return Object.keys(where).map(field => {
            const ac = action[field] || "=";
            return `${ASName}${field} ${ac} '${where[field]}'`
        }).join(" AND ")
    }

    /**
     * 查询单个数据
     * @param where 条件
     * @param fields 返回的字段名
     */
    public findOne(where?: T | T[], action?: TypeAction | TypeAction[], fields = ["*"]) {
        return database.prepare(`SELECT ${fields.join(",")} FROM ${this.tableName} ${this.parseWhere(where,action)}`).get() as T;
    }

    /**
     * 查询单个数据
     * @param where 条件
     * @param fields 返回的字段名
     */
    public find(where?: T | T[], action?: TypeAction | TypeAction[], fields = ["*"]) {
        return database.prepare(`SELECT ${fields.join(",")} FROM ${this.tableName} ${this.parseWhere(where,action)}`).all() as T[];
    }

    /**
     * 分页查询
     * @param orderBy 按什么排序
     * @param page 页码
     * @param size 每页个数
     * @param where 条件
     * @param fields 返回字段名
     */
    public findByPage(orderBy?: string, page = 0, size = 10, where?: T | T[], action?: TypeAction | TypeAction[], fields = ["*"]) {
        const whereStr = this.parseWhere(where, action);
        const countRes: any = database.prepare(`SELECT COUNT(*) AS count FROM ${this.tableName} ${whereStr}`).get();
        if (!countRes || countRes.count === 0) {
            return {
                total: 0,
                data: []
            }
        }
        let sql = `SELECT ${fields.join(",")} FROM ${this.tableName} ${whereStr}`
        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }
        sql += " LIMIT ? OFFSET ?";
        return {
            data: database.prepare(sql).all(size, page * size) as T[],
            total: countRes.count as number
        }
    }

    /**
     * 插入数据
     * @param data
     */
    public insert(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        return database.prepare(`INSERT INTO ${this.tableName} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`).run(data);
    }

    /**
     * 更新数据
     * @param where 条件
     * @param data 数据
     */
    public update(where: T | T[], data: T) {
        data = this.allowFields(data);
        const updateField = Object.keys(data).map(field => `${field}=:${field}`).join(",")
        const stmt = database.prepare(`UPDATE ${this.tableName} SET ${updateField} ${this.parseWhere(where)}`);
        return stmt.run(data);
    }

    /**
     * 判断主键的值是否存在，不存在创建，存在更新
     * @param data
     */
    public insertOrUpdate(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        const sql = `INSERT OR REPLACE INTO ${this.tableName} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`
        const stmt = database.prepare(sql);
        return stmt.run(data);
    }

    /**
     * 删除数据
     * @param where 条件
     */
    public delete(where?: T | T[], action?: TypeAction | TypeAction[],) {
        const stmt = database.prepare(`DELETE FROM ${this.tableName} ${this.parseWhere(where,action)}`);
        return stmt.run();
    }
}
