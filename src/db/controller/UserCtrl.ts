import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

/**
 * 用户表操作
 */
export class UserCtrl extends BaseDb {
    public static instance: UserCtrl = new UserCtrl();

    constructor() {
        super(ETables.user);
    }

}
