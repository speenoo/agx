CREATE TABLE IF NOT EXISTS tabs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contents TEXT NOT NULL,
    query_id INTEGER,
    tab_index INTEGER NOT NULL
);
