export enum ETables {
    user = "user"
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
    }
}
