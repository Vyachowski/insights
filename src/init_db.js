import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const initDb = () => {
    const dbName = 'ses-statistics'
    const dbFileExtension = 'sqlite3'
    const dbFileName = `${dbName}.${dbFileExtension}`
    const dbPath = path.resolve(process.cwd(), 'db', dbFileName)
    
    if (fs.existsSync(dbPath)) {
        return null;
    }

    const db = new Database(dbPath);

    if (db) {
        return true;
    }
}
