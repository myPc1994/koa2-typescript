import {Connection, Model, Schema, Document} from 'mongoose';
import {GlobalVariable} from "../GlobalVariable";
import {IKeyValue} from "../core/CpcInterface";

/**
 * 所有表格处理的基础类，表格处理必须要继承它
 */
export abstract class BaseDb {
    protected model: Model<Document>;
    protected abstract tableName:string;
    protected abstract tableSchema:IKeyValue;
    constructor() {
        GlobalVariable.dbUtil.onConnected((mongooseInstance: Connection) => {
            this.model = mongooseInstance.model(this.tableName, new Schema(this.tableSchema));
        });
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
     * @param {IKeyValue} filter 条件
     * @param {IKeyValue} data 存储的数据
     * @returns {any}
     */
    public saveOrUpdate(filter: IKeyValue, data: IKeyValue) {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return this.model.findOneAndUpdate(filter, {$set: data}, options).lean();

    }

    /**
     * 更新数据-更新一个
     * @param {IKeyValue} filter 条件
     * @param {IKeyValue} data 存储的数据
     * @returns {any}
     */
    public updateOne(filter: IKeyValue, data: IKeyValue) {
        return this.model.updateOne(filter, {$set: data}).lean();
    }

    /**
     * 更新数据-更新多个
     * @param {IKeyValue} filter
     * @param {IKeyValue} data
     * @returns {any}
     */
    public updateMany(filter: IKeyValue, data: IKeyValue[]) {
        return this.model.updateMany(filter, {$set: data}).lean();
    }

    /**
     * 删除数据-一条
     * @param {IKeyValue} filter
     */
    public deleteOne(filter: IKeyValue) {
        return this.model.deleteOne(filter).lean();
    }

    /**
     * 删除数据-多条
     * @param {IKeyValue} filter
     */
    public deleteMany(filter: IKeyValue) {
        return this.model.deleteMany(filter).lean();
    }

    /**
     * 不传移除所有表数据
     * @param filter
     */
    public remove(filter?: any) {
        return this.model.remove(filter).lean();
    }

    /**
     *  查询数据
     * @param {IKeyValue} filter
     * @param {IKeyValue} fields
     */
    public find(filter: IKeyValue = {}, fields: IKeyValue = {_id: 0}) {
        return this.model.find(filter, fields, {}).lean();
    }

    /**
     * 查询单条数据
     * @param {IKeyValue} filter
     * @param {IKeyValue} fields
     */
    public findOne(filter: IKeyValue = {}, fields: IKeyValue = {_id: 0}) {
        return this.model.findOne(filter, fields).lean();
    }

    /**
     * 返回符合条件的文档数
     * @param {IKeyValue} filter
     */
    public countDocuments(filter: IKeyValue = {}) {
        return this.model.countDocuments(filter).lean();
    }

    /**
     * 保存同时过滤相同数据
     * @param fields 唯一值判断
     * @param arr 需要判断的数组
     */
    public async saveOrFilterSame(fields: string[], arr: any[]) {
        const result = [];
        for (let item of arr) {
            const filter: any = {};
            for (let field of fields) {
                if (item[field]) {
                    filter[field] = item[field];
                }
            }
            const data = await this.saveOrUpdate(filter, item).lean();
            result.push(data);
        }
        return result;
    }
}
