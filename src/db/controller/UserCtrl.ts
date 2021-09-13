import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

export class UserCtrl extends BaseDb {
    public static instance: UserCtrl = new UserCtrl();

    constructor() {
        super(ETables.user);
    }

}
