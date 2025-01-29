CREATE TABLE IF NOT EXISTS tabs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    query_id INTEGER,
    tab_index INTEGER NOT NULL,
    active BOOL DEFAULT FALSE UNIQUE
);
