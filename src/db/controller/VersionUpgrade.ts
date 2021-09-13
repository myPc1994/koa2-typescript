import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

export class VersionUpgrade extends BaseDb {
    public static instance: VersionUpgrade = new VersionUpgrade();

    constructor() {
        super(ETables.versionUpgrade);
    }

}
