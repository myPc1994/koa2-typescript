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

export abstract class BaseTable<T extends IKeyValue<any>> {
    public tableName: string;//表名
    protected allFields: string[] = [];//表的所有字段
    protected constructor(tableName: string, fieldInfo: T, other?: string) {
        this.tableName = tableName;
        this.allFields = Object.keys(fieldInfo);
        _updateTable(tableName, fieldInfo, other);
    }

    /**
     * 允许字段的过滤,如果存在updateTime，同时更新时间戳
     * @param data 需要过滤的数据
     * @param fields 允许的字段，不传，数据库表字段存在的全部都允许
     * @param isReverse 是否反向过滤
     * @param allowValue 不参与过滤的值
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

    /**
     * 解析占位符，如果不存在，就自动补上默认值
     * @param str 字符串，这里解析的占位符只有 :开头的字段
     * @param data 数据
     * @param defV 默认值
     */
    public parseSqlData(str?: string, data?: T, defV = ""): T | undefined {
        if (!str) {
            return data;
        }
        const result: any = data || {};
        new Set(str.matchAll(/:(\w+)/g)).forEach(match => {
            result[match[1]] = defV
        })
        return result;
    }

    /**
     * 获取表的所有字段
     * @param noField 过滤不要的字段
     */
    public getFields(noField?: string[]) {
        if (!noField) {
            return this.allFields;
        }
        return this.allFields.filter(field => {
            return noField.indexOf(field) === -1;
        })
    }

    /**
     * 查询单个数据
     * @param data 数据
     * @param where 条件
     * @param fields 返回的字段名
     */
    public findOne(data?: T, where = '', fields = ["*"]) {
        data = this.parseSqlData(where, data);
        return database.prepare(`SELECT ${fields.join(",")} FROM ${this.tableName} ${where}`).get(data) as T;
    }

    /**
     * 查询数据
     * @param data 数据
     * @param where 条件
     * @param fields 返回的字段名
     * @param orderBy 按什么排序
     */
    public find(data?: T, where = '', fields = ["*"], orderBy?: string) {
        let sql = `SELECT ${fields.join(",")} FROM ${this.tableName} ${where}`;
        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }
        data = this.parseSqlData(sql, data);
        return database.prepare(sql).all(data) as T[];
    }

    /**
     * 分页查询
     * @param data 数据
     * @param where 条件
     * @param fields
     * @param orderBy 按什么排序
     */
    public findByPage(data: T & { page: number, size: number }, where = '', fields = ["*"], orderBy?: string) {
        data = this.parseSqlData(where, data) as any;
        const countRes: any = database.prepare(`SELECT COUNT(*) AS count FROM ${this.tableName} ${where}`).get(data);
        if (!countRes || countRes.count === 0) {
            return {
                total: 0,
                data: []
            }
        }
        data.page = data.page || 0;
        data.size = data.size || 10;
        (data as any).offset = data.page * data.size;
        let sql = `SELECT ${fields.join(",")} FROM ${this.tableName} ${where}`
        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }
        sql += " LIMIT :size OFFSET :offset";

        return {
            data: database.prepare(sql).all(data) as T[],
            total: countRes.count as number
        }
    }

    /**
     * 插入数据
     * @param data 数据
     */
    public insert(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        return database.prepare(`INSERT INTO ${this.tableName} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`).run(data);
    }

    /**
     * 更新数据
     * @param data 数据
     * @param where 条件
     */
    public update(data: T, where = '') {
        data = this.allowFields(data);
        const updateField = Object.keys(data).map(field => `${field}=:${field}`).join(",")
        return database.prepare(`UPDATE ${this.tableName} SET ${updateField} ${where}`).run(data);
    }

    /**
     * 判断主键的值是否存在，不存在创建，存在更新
     * @param data 数据
     */
    public insertOrUpdate(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        const sql = `INSERT OR REPLACE INTO ${this.tableName} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`
        return database.prepare(sql).run(data);
    }

    /**
     * 删除数据
     * @param data 数据
     * @param where 条件
     */
    public delete(data?: T, where?: string) {
        data = this.parseSqlData(where, data);
        return database.prepare(`DELETE FROM ${this.tableName} ${where}`).run(data);
    }
}
