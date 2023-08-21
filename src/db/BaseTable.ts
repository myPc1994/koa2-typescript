import {database} from "./index";
import {IKeyValue} from "../types/types";

export  type IBaseTable = {
    [field: string]: string
}

export abstract class BaseTable<T extends IKeyValue<any>> {
    public tableName: string;
    protected table: IBaseTable;
    protected allFields: string[] = [];

    constructor(tableName: string, table: IBaseTable, other?:string) {
        this.tableName = tableName;
        table.updateTime = "INTEGER"
        this.table = table;
        this.allFields = Object.keys(table);
        this.updateTable(tableName, table, other);
    }

    /**
     * 更新表格
     * @param tableName
     * @param table
     * @private
     */
    private updateTable(tableName: string, table: IBaseTable, other?: string) {
        const contentArr = Object.entries(table).map(kv => kv.join(" "));
        if(other){
            contentArr.push(other);
        }
        const content = contentArr.join(",");
        database.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${content})`);
        // 检查表的字段是否需要更新
        const checkColumnsQuery = `PRAGMA table_info(${tableName});`;
        const existingColumns = database.prepare(checkColumnsQuery).all();
        const missingkeys = Object.keys(table).filter(name => {
            // @ts-ignore
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

    public prepare(source: string) {
        return database.prepare(source);
    }

    //事务操作
    public transaction(fn: any) {
        return database.transaction(fn)();
    }

    /**
     * 构建where
     * @param where 条件
     * @param ASName 别名
     * @protected
     */
    protected _where(where?: string | T, ASName = "") {
        if (!where) {
            return "";
        }
        if (typeof where == "string") {
            return where;
        }
        if (Object.keys(where).length === 0) {
            return ""
        }
        //这里暂时只处理and方式
        const whereArr = Object.keys(where).map(field => `${ASName}${field}='${where[field]}'`)
        return "WHERE " + whereArr.join(" and ")
    }

    /**
     * 构建插入sql
     * @param data 数据
     * @protected
     */
    protected _insert(data: T | T[]) {
        let item;
        if (Array.isArray(data)) {
            item = data[0]
        } else {
            item = data;
        }
        const keys = Object.keys(item);
        return `INSERT INTO ${this.tableName} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`;
    }

    /**
     * 构建查询sql
     * @param where
     * @param fields
     * @protected
     */
    protected _select(where?: string | T, orderBy?: string, fields: string[] = ["*"]) {
        let sql = `SELECT ${fields.join(",")} FROM ${this.tableName} ${this._where(where)}`
        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }
        return sql;
    }

    /**
     * 构建更新sql
     * @param where
     * @param data
     * @protected
     */
    protected _update(where: string | T, data: T) {
        const updateField = Object.keys(data).map(field => `${field}=:${field}`).join(",")
        return `UPDATE ${this.tableName} SET ${updateField} ${this._where(where)}`
    }

    /**
     * 构建删除sql
     * @param where
     * @protected
     */
    protected _delete(where?: string | T) {
        return `DELETE FROM ${this.tableName} ${this._where(where)}`
    }

    protected _count(where?: string | T, field = "*") {
        return `SELECT COUNT(${field}) AS count FROM ${this.tableName} ${this._where(where)}`;
    }

    /**
     * 允许字段的过滤,如果存在updateTime，同时更新时间戳
     * @param data 需要过滤的数据
     * @param fields 允许的字段，不传，数据库表字段存在的全部都允许
     * @param isReverse 是否反向过滤
     * @param isUpdateTime 是否更新时间戳
     */
    public allowFields(data: T, fields?: string[], isReverse = false, isUpdateTime = true) {
        if (!fields) {
            fields = this.allFields
        } else if (isReverse) {
            fields = this.allFields.filter(item => fields?.indexOf(item) === -1);
        }
        const result: any = {};
        for (const field of fields) {
            const v = data[field];
            if (v || v === 0 || v ==='') {
                result[field] = data[field];
            }
        }
        if (isUpdateTime && fields.indexOf("updateTime") !== -1) {
            result.updateTime = new Date().getTime()
        }
        return result;
    }

    /**
     * 合并数据
     * @param data 源数据
     * @param field 唯一标识的字段
     * @param mergeFields 合并的字段，{key，value} 其中key代表要合并的字段名，value代表合并后的字段名
     * @param mergeFiled 合并后的字段，统一放到的字段名之下
     */
    public static mergeData(data: any[], field: string, mergeFields: any, mergeFiled = "other") {
        const mergedData: any = {};
        for (const item of data) {
            const id = item[field];
            if (!mergedData[id]) {
                mergedData[id] = [];
            } else {
                item.repeat = true;
            }
            const row: any = {};
            for (const key in mergeFields) {
                if (item[key] !== null) {
                    const v = mergeFields[key];
                    row[v] = item[key];
                }
                delete item[key];
            }
            if (Object.keys(row).length > 0) {
                mergedData[id].push(row)
            }
        }
        return data.filter(item => {
            if (!item.repeat) {
                item[mergeFiled] = mergedData[item[field]];
                return true;
            }
            return false;
        });
    }

    /**
     * 查询单个数据
     * @param where 条件
     * @param orderBy 按什么排序
     * @param fields 返回的字段名
     */
    public findOne(where?: string | T, orderBy?: string, fields = ["*"]): T | undefined {
        // @ts-ignore
        return this.prepare(this._select(where, orderBy, fields)).get();
    }

    /**
     * 查询所有数据
     * @param where 条件
     * @param orderBy 按什么排序
     * @param fields 返回的字段名
     */
    public find(where?: string | T, orderBy?: string, fields = ["*"]): T[] {
        // @ts-ignore
        return this.prepare(this._select(where, orderBy, fields)).all();
    }

    /**
     * 分页查询
     * @param where 条件
     * @param orderBy 按什么排序
     * @param page 页码
     * @param size 每页个数
     * @param fields 返回字段名
     */
    public findByPage(where?: string | T, orderBy?: string, page = 0, size = 10, fields = ["*"]) {
        const curWhere = this._where(where);
        const countRes: any = this.prepare(this._count(curWhere, fields[0])).get();
        if (!countRes || countRes.count === 0) {
            return {
                total: 0,
                data: []
            }
        }
        let sql = this._select(curWhere, orderBy, fields);
        sql += " LIMIT ? OFFSET ?";

        const result = {
            data: this.prepare(sql).all(size, page * size),
            total: countRes.count
        }
        return result;
    }


    /**
     * 插入数据
     * @param data 支持但数据和多数据插入
     */
    public insert(data: T) {
        data = this.allowFields(data);
        const stmt = this.prepare(this._insert(data));
        return stmt.run(data);
    }

    /**
     * 批量插入数据
     * @param data
     */
    public inserts(data: T[]) {
        if (data.length === 0) {
            return
        }
        data = data.map(item => this.allowFields(item))
        const stmt = this.prepare(this._insert(data));
        return this.transaction(() => {
            for (const item of data) {
                stmt.run(item);
            }
        });
    }

    /**
     * 更新数据
     * @param where 条件
     * @param data 数据
     */
    public update(where: string | T, data: T) {
        data = this.allowFields(data);
        const stmt = this.prepare(this._update(where, data));
        return stmt.run(data);
    }

    /**
     * 批量更新数据
     * @param data
     */
    public updates(fields: string[], data: T[]) {
        if (data.length === 0) {
            return
        }
        data = data.map(item => this.allowFields(item))
        const updateField = Object.keys(data[0]).map(field => `${field}=:${field}`).join(",")
        const whereField = fields.map(field => `${field}=:${field}`).join(",")
        const where = `UPDATE ${this.tableName} SET ${updateField} WHERE ${whereField}`
        const stmt = this.prepare(where);
        return this.transaction(() => {
            for (const item of data) {
                stmt.run(item);
            }
        });
    }

    /**
     * 判断主键的值是否存在，不存在创建，存在更新
     * @param data
     */
    public insertOrUpdate(data: T) {
        data = this.allowFields(data);
        let fields = ""
        const values = Object.keys(data).map((key) => {
            fields += key + ","
            return `:${key}`
        }).join(",");
        fields = fields.substring(0, fields.length - 1);
        const sql = `INSERT OR REPLACE INTO ${this.tableName} (${fields}) VALUES (${values})`
        const stmt = this.prepare(sql);
        return stmt.run(data);
    }

    /**
     * 批量处理，判断主键的值是否存在，不存在创建，存在更新
     * @param data
     */
    public insertOrUpdates(data: T[]) {
        if (data.length === 0) {
            return
        }
        data = data.map(item => this.allowFields(item))
        let fields = ""
        const values = Object.keys(data[0]).map((key) => {
            fields += key + ","
            return `:${key}`
        }).join(",");
        fields = fields.substring(0, fields.length - 1);
        // 依据是主键是否唯一
        const sql = `INSERT OR REPLACE INTO ${this.tableName} (${fields}) VALUES (${values})`
        const stmt = this.prepare(sql);
        return this.transaction(() => {
            for (const item of data) {
                stmt.run(item);
            }
        });
    }

    /**
     * 删除数据
     * @param where 条件
     */
    public delete(where?: string | T) {
        const stmt = this.prepare(this._delete(where));
        if(typeof where === 'string'){
            return stmt.run();
        }else{
            return stmt.run(where);
        }
    }
}
