import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

/**
 * 版本控制表
 */
export class VersionUpgradeCtrl extends BaseDb {
    public static instance: VersionUpgradeCtrl = new VersionUpgradeCtrl();

    constructor() {
        super(ETables.versionUpgrade);
    }

}
