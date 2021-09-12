import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";

export class UserController extends BaseDb {
    public static instance: UserController = new UserController();

    constructor() {
        super(ETables.user);
    }

}