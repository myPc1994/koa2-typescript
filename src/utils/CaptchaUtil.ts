import svgCaptcha from "svg-captcha";
import {IKeyValue} from "../core/CpcInterface";
import {v1} from 'uuid';
import schedule from 'node-schedule';
import {ResponseBeautifier, ResponseInfo} from "./ResponseBeautifier";
import {Context, Next} from 'koa';

let uuidMapCode: IKeyValue = {};
// 每天3点30分0秒，刷新容器
schedule.scheduleJob('0 30 3 * * *', () => {
    uuidMapCode = {};
});

export interface ICaptchaInfo {
    text: string,
    data: string,
    uuid?: string
}

/**
 * 验证码
 */
export class CaptchaUtil {

    /**
     * 算式验证码
     * @returns {any}
     */
    public static createMath(): ICaptchaInfo {
        // 数学表算式验证码
        let codeConfig = {
            mathMin: 1, // 数学表达式的最小值
            mathMax: 20, // 数学表达式的最大值
            mathOperator: '+', // 使用的运算符:+、-或+-(用于随机的+或-)
            noise: 5, // 干扰线条的数量
            width: 100, // 验证码宽度
            height: 40, // 验证码高度
            fontSize: 40,   // 字体大小
            color: true,    // 开启字体颜色
            background: '#cc9966',// 背景颜色
        }
        const obj = svgCaptcha.createMathExpr(codeConfig); // 算式验证码
        return CaptchaUtil.saveMap(obj)
    }

    /**
     * 字母验数字证码
     * @returns {any}
     */
    public static createLetter(): ICaptchaInfo {
        // 字母验数字证码
        let codeConfig = {
            size: 4,// 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 5, // 干扰线条的数量
            width: 100, // 验证码宽度
            height: 40, // 验证码高度
            fontSize: 40,   // 字体大小
            color: true,    // 开启字体颜色
            background: '#cc9966',// 背景颜色
            // charPreset:'abcd123456789', //随机预设字符
        }
        const obj = svgCaptcha.create(codeConfig); // 验证码
        return CaptchaUtil.saveMap(obj)
    }

    public static middleware(uuidField: string = "uuid", textField: string = "text") {
        return async function (ctx: Context, next: Next) {
            let data = null;
            if (ctx.method.toLocaleLowerCase() === "get") {
                data = ctx.request.query
            } else {
                data = ctx.request.body
            }
            if (CaptchaUtil.verify(data[uuidField], data[textField])) {
                return next();
            } else {
                return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "验证码错误!");
            }
        };
    }

    public static verify(uuid: string, text: string) {
        if (uuidMapCode[uuid]) {
            if (uuidMapCode[uuid] === text) {
                delete uuidMapCode[uuid];// 不管验证成功与否，都要清除记录
                return true;
            }
            delete uuidMapCode[uuid];// 不管验证成功与否，都要清除记录
        }
        return false;
    }

    private static saveMap(obj: ICaptchaInfo) {
        const uuid = v1();
        uuidMapCode[uuid] = obj.text;
        delete (obj as any).text;
        obj.uuid = uuid;
        return obj;
    }

}
