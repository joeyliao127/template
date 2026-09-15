-- 測試資料：啟動測試的 Spring context 時載入（application.properties 的 spring.sql.init.data-locations）。
-- 會寫資料的測試方法加 @Transactional，結束時回滾，所以每個測試開始時資料都是這個樣子。
-- 這份只給測試用；正式環境的種子資料是 Database/data.sql，兩份互不影響。
-- 改這份資料時，一起檢查各測試 class 上方 Javadoc 寫的前置資料。
--
-- 使用者（密碼都是 admin1234 的 BCrypt 雜湊，與 Database/data.sql 相同）：
--   id ...0001  tester    tester@example.com    controller 測試用它產生 JWT token；「email 重複」情境也用它的 email
--   id ...0002  reviewer  reviewer@example.com  第二位使用者，確認查詢條件真的有作用（不是剛好拿到第一筆）

INSERT INTO users (id, username, email, password) VALUES
('00000000-0000-0000-0000-000000000001',
 'tester',
 'tester@example.com',
 '$2a$10$D6/B/.ZQPHOBLaDrdQkprOXjk4JLRFrmBffcH6Bys9BRR5ZJeVAqq'),
('00000000-0000-0000-0000-000000000002',
 'reviewer',
 'reviewer@example.com',
 '$2a$10$D6/B/.ZQPHOBLaDrdQkprOXjk4JLRFrmBffcH6Bys9BRR5ZJeVAqq');
