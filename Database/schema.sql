-- Convention 說明
-- 1. Table name, column name 使用 snake 命名
-- 2. Table name 使用複數形式命名，避免與保留字衝突，如 order, group

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS schema_version CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 紀錄 schema 版本，供 migration 追蹤
CREATE TABLE schema_version (
  version       VARCHAR(50)   NOT NULL,
  applied_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (version)
);

CREATE TABLE users (
  id              UUID          NOT NULL,
  username        VARCHAR(50)   NOT NULL,
  email           VARCHAR(320)  NOT NULL,
  password        VARCHAR(255)  NOT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email),
  PRIMARY KEY (id)
);

CREATE INDEX idx_users_email ON users (email);
