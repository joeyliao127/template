---
description: 將此 template 初始化為新專案（驗證名稱、替換雙佔位符、改 Java package、產生 README）
argument-hint: <ProjectName> <一句專案描述>
---

你要把目前的 template 專案初始化成使用者指定的新專案。

使用者輸入：`$ARGUMENTS`
- 第一個詞 = 專案**顯示名稱**（品牌名，可含大寫，例如 `YanduoERP`）
- 其餘 = 專案**描述**（用於 README）

## 執行步驟

1. 在專案根目錄執行下列指令（腳本會自動：從顯示名稱推導小寫 slug 並驗證、替換 `__PROJECT_DISPLAY__`/`__PROJECT_NAME__`、把 Java package `com.penguin.template` 改為 `com.penguin.<slug>` 並改主類名、更新 `pom.xml`、產生 `README.md`、建立 `Docker/.env` 並寫入新的 `JWT_SECRET`、刪除 template 專用檔）：

   ```bash
   node .claude/commands/init-template.mjs $ARGUMENTS
   ```

2. 若指令以非零結束（例如名稱無法推導出合法 slug），把腳本的錯誤訊息原樣回報並停止，不要自行修補。

3. 成功後，簡短回報：display name、slug、Java package、`README.md` 重點，並提醒使用者：
   - 尚未 build／啟動；首次 `pnpm install` 會重新產生 `pnpm-lock.yaml`。
   - 可用 `git init` 重新建立版本控制。

## 注意

- 不要執行 build 或啟動 app。
- 不要在替換前後額外手動編輯檔案；一切交給腳本，確保結果一致可重現。
