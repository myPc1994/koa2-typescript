import BetterSqlite3 from "better-sqlite3";
import path from "path";
import fs from "fs";

function connectDb(): BetterSqlite3.Database {
    let db: any;
    const options: BetterSqlite3.Options = {};
    if (process.env.NODE_ENV === "development") {
        options.verbose = console.log
    }
    try {
        const directoryPath = path.join(__dirname, '../../db');
        const dbPath = path.join(directoryPath, 'database.db');
        fs.mkdirSync(directoryPath, {recursive: true});
        db = new BetterSqlite3(dbPath, options)
        console.log('数据库连接成功!', dbPath);
    } catch (err) {
        console.error('数据库连接发生过程中发生了错误!', err);
    }
    return db;
}

export const database = connectDb();
process.on('exit', () => database.close());
