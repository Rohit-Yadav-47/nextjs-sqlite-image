import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    try {
      db = new Database(dbPath);
      
      // Initialize the database with a simple table
      db.exec(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL
        )
      `);
      
      console.log('SQLite database connected successfully');
    } catch (error) {
      console.error('Failed to connect to SQLite database:', error);
      throw error;
    }
  }
  
  return db;
}

export function checkDbConnection(): boolean {
  try {
    const db = getDb();
    db.prepare('SELECT 1').get();
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

export function getAllItems(): Array<{ id: number; text: string }> {
  try {
    const db = getDb();
    return db.prepare('SELECT id, text FROM items ORDER BY id').all() as Array<{ id: number; text: string }>;
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
}

export function addItem(text: string): boolean {
  try {
    const db = getDb();
    db.prepare("INSERT INTO items (text) VALUES (?)").run(text);
    return true;
  } catch (error) {
    console.error('Error adding item:', error);
    return false;
  }
}

export function removeItem(id: number): boolean {
  try {
    const db = getDb();
    db.prepare("DELETE FROM items WHERE id = ?").run(id);
    return true;
  } catch (error) {
    console.error('Error removing item:', error);
    return false;
  }
}
