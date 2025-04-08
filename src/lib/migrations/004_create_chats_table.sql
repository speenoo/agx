CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    messages TEXT NOT NULL,
    dataset TEXT,
    idx INTEGER NOT NULL,
    active BOOL UNIQUE
);
