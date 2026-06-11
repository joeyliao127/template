---
description: 將此 template 初始化為新專案（驗證名稱、替換雙佔位符、改 Java package、產生 README）
argument-hint: <ProjectName> <一句專案描述>
---

你要以目前的 template 為藍本，產生使用者指定的新專案。腳本會在 **template 同一層**複製出一個以 slug 命名的新資料夾，並在該副本上完成初始化；**原 template 保持不變**。

使用者輸入：`$ARGUMENTS`
- 第一個詞 = 專案**顯示名稱**（品牌名，可含大寫，例如 `YanduoERP`）
- 其餘 = 專案**描述**（用於 README）

## 執行步驟

1. 在 template 專案根目錄執行下列指令（腳本會自動：從顯示名稱推導小寫 slug 並驗證、複製 template 到同層的 `../<slug>/`（排除 `.git`/`node_modules`/建置產物/`Docker/.env`/`Database/data`）、在副本中替換 `__PROJECT_DISPLAY__`/`__PROJECT_NAME__`、把 Java package `com.penguin.template` 改為 `com.penguin.<slug>` 並改主類名、更新 `pom.xml`、產生 `README.md`、建立 `Docker/.env` 並寫入新的 `JWT_SECRET`、移除副本中的 `.claude/commands` 與 template 專用檔）：

   ```bash
   node .claude/commands/init-template.mjs $ARGUMENTS
   ```

2. 若指令以非零結束（例如名稱無法推導出合法 slug、或目標資料夾已存在），把腳本的錯誤訊息原樣回報並停止，不要自行修補。

3. 成功後，簡短回報：新專案資料夾路徑、display name、slug、Java package、`README.md` 重點，並提醒使用者：
   - 原 template 未變動；新專案在 `../<slug>/`，需 `cd` 進去再操作。
   - 尚未 build／啟動；首次 `pnpm install` 會重新產生 `pnpm-lock.yaml`。
   - 可在新資料夾用 `git init` 重新建立版本控制。
   - 本機 HTTPS 前置（首次一次性）：`startup.sh` 會自動以 mkcert 生成 SSL 憑證，但仍需使用者先 `mkcert -install`（安裝本機 CA），並在 `/etc/hosts` 加入 `127.0.0.1 <slug>.local.com`。

## 注意

- 不要執行 build 或啟動 app。
- 不要在替換前後額外手動編輯檔案；一切交給腳本，確保結果一致可重現。
