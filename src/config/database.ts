import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

class DatabaseConnection {
    private static instance: Database | null = null;

    public static async getInstance(): Promise<Database> {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = await open({
                filename: './orders.db',
                driver: sqlite3.Database
            });
            await DatabaseConnection.initializeTables(DatabaseConnection.instance);
        }
        return DatabaseConnection.instance;
    }

    private static async initializeTables(db: Database): Promise<void> {
        await db.run(
            `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                status TEXT DEFAULT 'PENDING'
            )`
        );
        try {
            await db.run(`ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'PENDING'`);
        } catch (e) {
            // It's expected to throw if the column already exists
        }
        console.log('Database and orders table are ready.');
    }
}

export const getDbConnection = async (): Promise<Database> => {
    return await DatabaseConnection.getInstance();
};
