import {database} from "./index";
import {IKeyValue} from "../types/types";

export abstract class Base<T extends IKeyValue<any>> {
    public name: string;//表名
    protected allFields: string[] = [];//表的所有字段
    protected constructor(name: string, fieldInfo: T) {
        this.name = name;
        this.allFields = Object.keys(fieldInfo);
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
            const field = match[1];
            result[field] = (data as any)[field] || defV;
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
        return database.prepare(`SELECT ${fields.join(",")} FROM ${this.name} ${where}`).get(data) as T;
    }

    /**
     * 查询数据
     * @param data 数据
     * @param where 条件
     * @param fields 返回的字段名
     * @param orderBy 按什么排序
     */
    public find(data?: T, where = '', fields = ["*"], orderBy?: string) {
        let sql = `SELECT ${fields.join(",")} FROM ${this.name} ${where}`;
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
    public findByPage(data: T & { page?: number, size?: number }, where = '', fields = ["*"], orderBy?: string) {
        data = this.parseSqlData(where, data) as any;
        const countRes: any = database.prepare(`SELECT COUNT(*) AS count FROM ${this.name} ${where}`).get(data);
        if (!countRes || countRes.count === 0) {
            return {
                total: 0,
                data: []
            }
        }
        data.page = data.page || 0;
        data.size = data.size || 10;
        (data as any).offset = data.page * data.size;
        let sql = `SELECT ${fields.join(",")} FROM ${this.name} ${where}`
        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }
        sql += " LIMIT :size OFFSET :offset";

        return {
            data: database.prepare(sql).all(data) as T[],
            total: countRes.count as number
        }
    }
}
