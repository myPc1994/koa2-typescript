import crypto from 'crypto';

/**
 * 加解密
 */
export class CryptoTool {
    /**
     * 密码加盐
     * @param {string} password 密码
     * @param {string} salt 盐   为什么不使用固定盐 https://www.oschina.net/news/49852/salted-password-hash
     * @returns {string}
     */
    public static saltHashPassword(password: string, salt: string) {
        const hash = crypto.createHmac('sha512', salt);
        /** 散列算法sha512 */
        hash.update(password);
        return hash.digest('hex');
    }
}
