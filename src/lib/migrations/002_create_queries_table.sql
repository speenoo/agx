CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sql TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS update_queries_updated_at
AFTER UPDATE ON queries
FOR EACH ROW
BEGIN
    UPDATE queries
    SET updated_at = datetime('now')
    WHERE id = OLD.id;
END;
