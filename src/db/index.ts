import BetterSqlite3 from "better-sqlite3";
import path from "path";
import fs from "fs";

function connectDb(): BetterSqlite3.Database {
    let db: any;
    const dbConfig = global._envConfig.db;
    const options: BetterSqlite3.Options = dbConfig.options || {};
    if (process.env.NODE_ENV === "development") {
        options.verbose = console.log
    }
    try {
        const dbPath = path.join(__dirname, "../../",dbConfig.path);
        fs.mkdirSync(path.dirname(dbPath), {recursive: true});
        db = new BetterSqlite3(dbPath, options)
        console.log('数据库连接成功!', dbPath);
    } catch (err) {
        console.error('数据库连接发生过程中发生了错误!', err);
    }
    return db;
}

export const database = connectDb();
process.on('exit', () => database.close());