import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

let _db: InstanceType<typeof Database> | null = null

export function useDB() {
  if (!_db) {
    const dir = join(process.cwd(), '.data')
    mkdirSync(dir, { recursive: true })
    _db = new Database(join(dir, 'app.sqlite'))
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')

    _db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_slug TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `)
  }
  return _db
}
