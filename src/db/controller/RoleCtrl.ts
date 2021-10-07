import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

/**
 * 角色表操作
 */
export class RoleCtrl extends BaseDb {
    public static instance: RoleCtrl = new RoleCtrl();

    constructor() {
        super(ETables.role);
    }

}
