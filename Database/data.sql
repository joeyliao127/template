-- Schema 版本
INSERT INTO schema_version (version) VALUES ('1.0.0');

-- 預設管理者帳號
-- email: admin@__PROJECT_NAME__.com
-- password: admin1234 (BCrypt 加密)
INSERT INTO users (id, username, email, password) VALUES
('00000000-0000-0000-0000-000000000001',
 'admin',
 'admin@__PROJECT_NAME__.com',
 '$2a$10$D6/B/.ZQPHOBLaDrdQkprOXjk4JLRFrmBffcH6Bys9BRR5ZJeVAqq');
