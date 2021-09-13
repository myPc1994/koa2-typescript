import {ICpcVersion} from "../core/CpcInterface";

export class JsUtil {
    public static versionCheck(addV: ICpcVersion, dbV: ICpcVersion) {
        if (addV.version_1 < dbV.version_1) {
            return false;
        }
        if (addV.version_1 > dbV.version_1) {
            return true;
        }
        // 到此version_1一定相等
        if (addV.version_2 < dbV.version_2) {
            return false;
        }
        if (addV.version_2 > dbV.version_2) {
            return true;
        }
        // 到此version_2一定相等
        if (addV.version_3 <= dbV.version_3) {
            return false;
        }
        if (addV.version_3 > dbV.version_3) {
            return true;
        }
    }
}