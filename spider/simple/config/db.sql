-- 新闻历史记录表
CREATE TABLE IF NOT EXISTS SPIDER_HISTORY (
    id INTEGER PRIMARY KEY,     -- 逻辑主键
    content_id TEXT,            -- 内容id，可能重复，便于编辑查询
    publish_date INTEGER,       -- 新闻发布时间
    create_date INTEGER,        -- 记录创建时间
    update_date INTEGER,        -- 记录更新时间
    url TEXT,                   -- 新闻 url
    content_hash TEXT,          -- 新闻内容的哈希
    abandoned INTEGER DEFAULT 0 -- 是否废弃，0 - 否，1 - 已废弃 
);

-- 内容哈希索引，利于查询
CREATE INDEX IF NOT EXISTS SPIDER_HISTORY_CONTENT_HASH_IDX ON SPIDER_HISTORY (content_hash);

-- url 建索引，利于查询
CREATE  INDEX IF NOT EXISTS URLS_URL_IDX ON SPIDER_HISTORY (url);
