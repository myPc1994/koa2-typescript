import {Connection, Model, Schema, Document} from 'mongoose';
import {GlobalVariable} from "../GlobalVariable";
import {ETables, tables} from '../db/tables';
import {keyValue} from "../core/CpcInterface";

export abstract class BaseDb {
    protected model: Model<Document>;

    constructor(name: ETables) {
        GlobalVariable.dbUtil.onConnected((mongooseInstance: Connection) => {
            this.model = mongooseInstance.model(name, new Schema(tables[name]));
        })
    }

    /**
     * 保存数据
     * @param {keyValue} data
     * @returns {any}
     */
    public save(data: keyValue) {
        let entity = new this.model(data);
        return entity.save();
    }

    /**
     * 保存多个数据
     * @param {Array<keyValue>} dataArr
     */
    public saves(dataArr: Array<keyValue>) {
        return this.model.insertMany(dataArr);
    }

    /**
     *  保存数据，数据存在，变为更新数据
     * @param {keyValue} where
     * @param {keyValue} data
     * @returns {any}
     */
    public saveOrUpdate(where: keyValue, data: keyValue) {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return this.model.findOneAndUpdate(where, {$set: data}, options);

    }

    /**
     * 更新数据-更新一个
     * @param {keyValue} where
     * @param {keyValue} data
     * @returns {any}
     */
    public updateOne(where: keyValue, data: keyValue) {
        return this.model.updateOne(where, {$set: data});
    }

    /**
     * 更新数据-更新多个
     * @param {keyValue} where
     * @param {keyValue} data
     * @returns {any}
     */
    public updateMany(where: keyValue, data: keyValue) {
        return this.model.updateMany(where, {$set: data});
    }

    /**
     * 删除数据-一条
     * @param {keyValue} where
     */
    public deleteOne(where: keyValue) {
        return  this.model.deleteOne(where);
    }

    /**
     * 删除数据-多条
     * @param {keyValue} where
     */
    public deleteMany(where: keyValue) {
        return  this.model.deleteMany(where);
    }

    /**
     *  查询数据
     * @param {keyValue} where
     * @param {keyValue} fields
     */
    public find(where: keyValue={}, fields: keyValue = {_id: 0}) {
        return this.model.find(where, fields, {});
    }

    /**
     * 查询单条数据
     * @param {keyValue} where
     * @param {keyValue} fields
     */
    public findOne(where: keyValue, fields: keyValue = {_id: 0}) {
        return  this.model.findOne(where, fields);
    }

    /**
     * 返回符合条件的文档数
     * @param {keyValue} where
     */
    public countDocuments(where: keyValue={}) {
        return this.model.countDocuments(where);
    }
}


