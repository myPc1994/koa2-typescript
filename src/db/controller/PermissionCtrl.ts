import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

/**
 * 权限表操作
 */
export class PermissionCtrl extends BaseDb {
    public static instance: PermissionCtrl = new PermissionCtrl();

    constructor() {
        super(ETables.permission);
    }

}
