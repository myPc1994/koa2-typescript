import {v1} from 'uuid';

export enum ETables {
    user = "user",
    versionUpgrade = "versionUpgrade"
}

export const tables = {
    [ETables.user]: {
        user: {type: String, require: true, ref: 'User'},
        price: {type: String, required: true},
        type: {type: String, required: true, default: 'sell', enum: ['sell', 'buy']},
        status: {type: Number, required: true, default: 0, enum: [0, 1, 2]},
        currencyCode: {type: String, required: true, default: 'btc'},
        paymentTypes: {type: String, required: true, default: '1'},
        unit: {type: String, required: true, default: 'CNY'},
        quantity: {type: Number, required: true, default: 0},
        minAmount: {type: Number, required: true, default: 0},
        maxAmount: {type: Number, required: true, default: 0},
        description: String,
        createTime: {type: Date, default: Date.now},
        updateTime: {type: Date, default: Date.now},
    },
    [ETables.versionUpgrade]: {
        createTime: {
            type: String,
            default: () => {
                return new Date().getTime()
            }
        },
        version_1: {type: String, required: true},// 第一级：重大重构
        version_2: {type: String, required: true},// 第二级：重大功能改进
        version_3: {type: String, required: true},// 第三极：小升级或者BUG修复
        hasUpgrade: {type: Boolean, required: false},// 是否强制升级
        type: {type: String, required: true},// pc,android,ios
        title: {type: String, required: true},// 升级信息标题
        description: {type: String, required: true},// 升级信息描述
    }
}

