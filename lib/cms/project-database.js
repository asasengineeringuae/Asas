import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const KEY = Symbol.for('asas.cms.projects.sqlite.v1');

export function portfolioDatabaseFile() {
  if (process.env.ASAS_PORTFOLIO_DB) return process.env.ASAS_PORTFOLIO_DB;
  if (process.env.VERCEL) return path.join(tmpdir(), 'asas', 'cms', 'projects.sqlite');
  return path.join(process.cwd(), '.data', 'cms', 'projects.sqlite');
}

export function portfolioDatabase() {
  const file = portfolioDatabaseFile();
  if (globalThis[KEY]?.file === file) return globalThis[KEY].db;
  if (file !== ':memory:') mkdirSync(path.dirname(file), {recursive: true});
  const db = new DatabaseSync(file, {timeout: 5000});
  const journal = process.env.VERCEL ? 'DELETE' : 'WAL';
  db.exec(`PRAGMA journal_mode=${journal}; PRAGMA synchronous=FULL;
    CREATE TABLE IF NOT EXISTS projects (
      slug TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'published',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_id INTEGER,
      updated_at TEXT NOT NULL,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS projects_status ON projects(status);
    PRAGMA user_version=1;`);
  globalThis[KEY] = {file, db};
  return db;
}

function parseRow(row) {
  if (!row) return null;
  try {
    return JSON.parse(row.data);
  } catch {
    return null;
  }
}

export function listPortfolioRows() {
  return portfolioDatabase()
    .prepare('SELECT data FROM projects ORDER BY COALESCE(sort_id, 999999), slug')
    .all()
    .map(parseRow)
    .filter(Boolean);
}

export function getPortfolioRow(slug) {
  return parseRow(
    portfolioDatabase().prepare('SELECT data FROM projects WHERE slug=?').get(String(slug || '')),
  );
}

export function countPortfolioRows() {
  return Number(portfolioDatabase().prepare('SELECT COUNT(*) AS n FROM projects').get()?.n || 0);
}

export function upsertPortfolioRow(project) {
  const slug = String(project?.slug || '').trim();
  if (!slug) {
    const error = new Error('Project slug is required');
    error.status = 400;
    throw error;
  }
  const record = {
    ...project,
    slug,
    id: project.id || slug,
    status: project.status || 'published',
    updatedAt: project.updatedAt || new Date().toISOString(),
  };
  portfolioDatabase()
    .prepare(
      `INSERT INTO projects(slug, status, featured, sort_id, updated_at, data)
       VALUES(?,?,?,?,?,?)
       ON CONFLICT(slug) DO UPDATE SET
         status=excluded.status,
         featured=excluded.featured,
         sort_id=excluded.sort_id,
         updated_at=excluded.updated_at,
         data=excluded.data`,
    )
    .run(
      slug,
      record.status,
      record.featured ? 1 : 0,
      Number.isFinite(Number(record.id)) ? Number(record.id) : null,
      record.updatedAt,
      JSON.stringify(record),
    );
  return record;
}

export function deletePortfolioRow(slug) {
  portfolioDatabase().prepare('DELETE FROM projects WHERE slug=?').run(String(slug || ''));
  return true;
}

export function replacePortfolioRows(items) {
  const db = portfolioDatabase();
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec('DELETE FROM projects');
    for (const item of items) upsertPortfolioRow(item);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return listPortfolioRows();
}
