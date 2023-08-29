import {database} from "./index";
import {IKeyValue} from "../types/types";
import {Statement} from "better-sqlite3";
import {Base} from "./Base";

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

export abstract class BaseTable<T extends IKeyValue<any>> extends Base<T> {
    protected constructor(name: string, fieldInfo: T, other?: string) {
        super(name,fieldInfo);
        _updateTable(name, fieldInfo, other);
    }
    /**
     * 插入数据
     * @param data 数据
     */
    public insert(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        return database.prepare(`INSERT INTO ${this.name} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`).run(data);
    }

    /**
     * 批量插入数据
     * @param datas 数据
     */
    public inserts(datas: T[]) {
        database.transaction(() => {
            for (const data of datas) {
                this.insert(data);
            }
        })();
    }

    /**
     * 更新数据
     * @param data 数据
     * @param where 条件
     */
    public update(data: T, where = '') {
        data = this.allowFields(data);
        const updateField = Object.keys(data).map(field => `${field}=:${field}`).join(",")
        return database.prepare(`UPDATE ${this.name} SET ${updateField} ${where}`).run(data);
    }

    /**
     * 判断主键的值是否存在，不存在创建，存在更新
     * @param data 数据
     */
    public insertOrUpdate(data: T) {
        data = this.allowFields(data);
        const keys = Object.keys(data);
        const sql = `INSERT OR REPLACE INTO ${this.name} (${keys.join(",")}) VALUES (${keys.map(field=>`:${field}`).join(",")})`
        return database.prepare(sql).run(data);
    }

    /**
     * 删除数据
     * @param data 数据
     * @param where 条件
     */
    public delete(data?: T, where?: string) {
        data = this.parseSqlData(where, data);
        return database.prepare(`DELETE FROM ${this.name} ${where}`).run(data);
    }
}
