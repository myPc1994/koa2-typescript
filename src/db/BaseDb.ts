import {Connection, Model, Schema, Document} from 'mongoose';
import {GlobalVariable} from "../GlobalVariable";
import {ETables, tables} from '../db/tables';
import {IKeyValue} from "../core/CpcInterface";

/**
 * 所有表格处理的基础类，表格处理必须要继承它
 */
export abstract class BaseDb {
    protected model: Model<Document>;

    constructor(name: ETables) {
        GlobalVariable.dbUtil.onConnected((mongooseInstance: Connection) => {
            this.model = mongooseInstance.model(name, new Schema(tables[name]));
        })
    }

    /**
     * 保存数据
     * @param {IKeyValue} data
     * @returns {any}
     */
    public save(data: IKeyValue) {
        let entity = new this.model(data);
        return entity.save();
    }

    /**
     * 保存多个数据
     * @param {Array<IKeyValue>} dataArr
     */
    public saves(dataArr: IKeyValue[]) {
        return this.model.insertMany(dataArr);
    }

    /**
     *  保存数据，数据存在，变为更新数据
     * @param {IKeyValue} where
     * @param {IKeyValue} data
     * @returns {any}
     */
    public saveOrUpdate(where: IKeyValue, data: IKeyValue) {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return this.model.findOneAndUpdate(where, {$set: data}, options);

    }

    /**
     * 更新数据-更新一个
     * @param {IKeyValue} where
     * @param {IKeyValue} data
     * @returns {any}
     */
    public updateOne(where: IKeyValue, data: IKeyValue) {
        return this.model.updateOne(where, {$set: data});
    }

    /**
     * 更新数据-更新多个
     * @param {IKeyValue} where
     * @param {IKeyValue} data
     * @returns {any}
     */
    public updateMany(where: IKeyValue, data: IKeyValue) {
        return this.model.updateMany(where, {$set: data});
    }

    /**
     * 删除数据-一条
     * @param {IKeyValue} where
     */
    public deleteOne(where: IKeyValue) {
        return this.model.deleteOne(where);
    }

    /**
     * 删除数据-多条
     * @param {IKeyValue} where
     */
    public deleteMany(where: IKeyValue) {
        return this.model.deleteMany(where);
    }

    /**
     * 不传移除所有表数据
     * @param filter
     */
    public remove(filter?:any){
        return this.model.remove(filter);
    }
    /**
     *  查询数据
     * @param {IKeyValue} where
     * @param {IKeyValue} fields
     */
    public find(where: IKeyValue = {}, fields: IKeyValue = {_id: 0}) {
        return this.model.find(where, fields, {});
    }

    /**
     * 查询单条数据
     * @param {IKeyValue} where
     * @param {IKeyValue} fields
     */
    public findOne(where: IKeyValue = {}, fields: IKeyValue = {_id: 0}) {
        return this.model.findOne(where, fields);
    }

    /**
     * 返回符合条件的文档数
     * @param {IKeyValue} where
     */
    public countDocuments(where: IKeyValue = {}) {
        return this.model.countDocuments(where);
    }

    /**
     * 保存同时过滤相同数据
     * @param fields 唯一值判断
     * @param arr 需要判断的数组
     */
    public async saveOrFilterSame(fields: string[], arr: any[]) {
        const result = [];
        for (let item of arr) {
            const where:any = {};
            for (let field of fields) {
                if (item[field]) {
                    where[field] = item[field];
                }
            }
            const data = await this.saveOrUpdate(where, item);
            result.push(data);
        }
        return result;
    }
}
