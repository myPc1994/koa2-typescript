import {v1} from 'uuid';

export enum ETables {
    user = "user", // 用户
    versionUpgrade = "versionUpgrade",// 版本升级
    nucleicAcid = "nucleicAcid",// 核酸
    keyArea = "keyArea",// 时空伴随-重点区域
    cluesMoPai = "cluesMoPai",// 线索摸排
    sceneDirectory = "sceneDirectory"// 场景目录树
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
    },
    [ETables.nucleicAcid]: {
        createTime: {
            type: String,
            default: () => {
                return new Date().getTime()
            }
        },// 创建时间
        num: {type: Number, required: true}, // 核酸检测数量
        No: {type: Number, required: true}, // 序号
        sampleName: {type: String, required: true},// 采样点名称
        updateTime: {type: Number, required: true},// 更新时间
        county: {type: String, required: true}// 区县
    },
    [ETables.keyArea]: {
        county: {type: String, required: true},// 区县
        receivingNum: {type: Number, required: true},// 接收人数
        haveCheck: {type: Number, required: true},// 已核查
        notCheck: {type: Number, required: true},// 未核查
        notCheck24H: {type: Number, required: true},// 超24小时未核查
        updateTime: {type: Number, required: true}// 更新时间
    },
    [ETables.cluesMoPai]: {
        createTime: {
            type: String,
            default: () => {
                return new Date().getTime()
            }
        },// 创建时间
        county: {type: String, required: true},// 区县
        receivingNum: {type: Number, required: true},// 接收人数
        haveCheck: {type: Number, required: true},// 已核查
        notCheck: {type: Number, required: true},// 未核查
        updateTime: {type: Number, required: true},// 更新时间
        verifyNum: {type: Number, required: true},// 核实人数(有效)
        invalidCombin: {type: Number, required: true},// 无效合计
        duplicateData: {type: Number, required: true},// 重复数据
        notToAffectedArea: {type: Number, required: true},// 未到疫区
        infoNotComplete: {type: Number, required: true},// 信息不全
        outProvinceNum: {type: Number, required: true},// 在省外总数
        inProvinceNum: {type: Number, required: true},// 在省内总数
        highRisk: {type: Number, required: true},// 高风险来闽
        middleRisk: {type: Number, required: true},// 中风险来闽
        lowRisk: {type: Number, required: true},// 低风险来闽
    },
    [ETables.sceneDirectory]: {
        createTime: {
            type: String,
            default: () => {
                return new Date().getTime()
            }
        },// 创建时间
        name: {type: String, required: true},// 名称
        active: {type: Boolean, required: true},// 是否是初始化场景
        value: {type: String, required: true},// 专题图场景的名称
        image: {type: String, required: true},// 图片，base64
    },
}

