import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";
import {Context, Next} from 'koa';
import moment from 'moment';
import {ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {JsUtil} from "../../utils/JsUtil";

/**
 * 场景目录树
 */
export class SceneDirectoryCtrl extends BaseDb {
    public static instance: SceneDirectoryCtrl = new SceneDirectoryCtrl();

    constructor() {
        super(ETables.sceneDirectory);
    }
}
