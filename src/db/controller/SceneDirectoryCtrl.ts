import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

/**
 * 场景目录树
 */
export class SceneDirectoryCtrl extends BaseDb {
    public static instance: SceneDirectoryCtrl = new SceneDirectoryCtrl();

    constructor() {
        super(ETables.sceneDirectory);
    }
}
