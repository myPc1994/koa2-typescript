import {BaseDb} from "../../BaseDb";
import {Schema} from 'mongoose';
import {IKeyValue} from "../../../core/CpcInterface";
import {v1} from 'uuid';
import {IReturnInfo, ResponseInfo} from "../../../utils/ResponseBeautifier";
import {RoleAuthCtrl} from "./RoleAuthCtrl";
import path from 'path';
import fs from 'fs';
import Router from 'koa-router';
import {JsUtil} from "../../../utils/JsUtil";

/**
 * 权限
 */
export class Auth extends BaseDb {
    protected tableName: string = "Auth";
    protected tableSchema: IKeyValue = {
        authId: {type: String, required: true, unique: true, default: () => v1()},
        type: {type: String, required: true},
        subType: {type: String, required: true},
        name: {type: String, required: true},
        describe: {type: String},
        createTime: {type: String, default: () => new Date().getTime()},
    };

    public async addAuth(type: string, subType: string, name: string): Promise<IReturnInfo> {
        const userInfo = await this.findOne({type, subType, name});
        if (userInfo) {
            return {...ResponseInfo.dataError, message: "该权限已存在!"};
        }
        const data: IKeyValue = await this.save({type, subType, name});
        return {...ResponseInfo.success, data};
    }

    public async deleteAuth(authId: string): Promise<IReturnInfo> {
        const data = await this.deleteOne({authId});
        if (data.deletedCount === 0) {
            return {...ResponseInfo.dataError, message: "删除个数为0,删除失败!"};
        }
        await RoleAuthCtrl.deleteMany({authId});// 同时需要删除用户角色表的关系
        return ResponseInfo.success;
    }

    protected createModelEnd(schema: Schema) {
        this.importAllRouter();
    }

    private async importAllRouter() {
        const auths: any = [];
        fs.readdirSync(path.resolve(__dirname, '../../../routes/routers')).forEach(file => {
            let block = fs.readFileSync(path.resolve(__dirname, `../../../routes/routers/${file}`), 'utf8');
            // 以下代码，都是参考apidoc的源码而得到的
            // Replace Linebreak with Unicode
            block = block.replace(/\n/g, '\uffff');
            // Elements start with @api
            const elementsRegExp = /(@(api\w*)\s?(.*?)(?=\uffff[\s*]*@api|$))/gm;
            let matches = elementsRegExp.exec(block);
            while (matches) {
                let content = matches[3];
                if (matches[2].toLowerCase() === "api") {
                    content = content.replace(/\uffff/g, '\n').trim();
                    // Search: type, url and title
                    // Example: {get} /user/:id Get User by ID.
                    const parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(.+?)(?:\s+(.+?))?$/g;
                    const matches = parseRegExp.exec(content);
                    if (!matches) {
                        return null;
                    }
                    const subType = matches[1].toUpperCase();
                    const name = matches[2];
                    const describe = matches[3] || '';
                    auths.push({
                        type: "_router_",
                        subType,
                        name,
                        describe,
                    })
                }
                // next Match
                matches = elementsRegExp.exec(block);
            }
        });
        const routers = await this.find({type: "_router_"}, {_id: 0, __v: 0});
        const result = JsUtil.splitArrayMeet(routers, auths, ["subType", "name", "describe"]);
        const {meet, noMeet, noMeet2} = JsUtil.splitArrayMeet(result.noMeet2, result.noMeet, ["subType", "name"]);
        console.log("03",meet, noMeet, noMeet2)
        // 说明只是修改了描述，不需要删除，而是修改
        if (meet) {
            for (const item of meet) {
                const filter = {type: "_router_", subType: item.subType, name: item.name};
                await this.updateOne(filter, item);
            }
        }
        // 数据库中不存在的
        if (noMeet.length > 0) {
            await this.saves(noMeet);
        }
        // 数据库中存在，但是已经变更了，需要同时删除表关系
        if (noMeet2.length > 0) {
            const deleteRouters = noMeet2.map((item: any) => item.authId);
            await this.deleteMany({authId: {$in: deleteRouters}});
            await RoleAuthCtrl.deleteMany({authId: {$in: deleteRouters}});// 同时需要删除用户角色表的关系
        }
    }
}

export const AuthCtrl = new Auth();
