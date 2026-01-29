import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const initDb = () => {
    const dbName = 'ses-statistics'
    const dbFileExtension = 'sqlite3'
    const dbFileName = `db/${dbName}.${dbFileExtension}`
    const dbPath = path.resolve(process.cwd, dbFileName)

    if (fs.accessSync(dbPath)) {
        return null;
    }

    const db = new Database(dbFileName);

    if (db) {
        return true;
    }
}
