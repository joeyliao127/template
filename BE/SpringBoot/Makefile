.PHONY: re build logs

# 多階段建構開發迴圈：改完 Java 後重新打包 jar 並重啟 springboot。
# build stage 在容器內跑 mvn package（依賴已於 dependency:go-offline 那層 cache），
# 取代舊的「host mvn 打包 + docker cp」流程。
# 從 Docker/ 目錄執行 compose，才會讀到 Docker/.env。
re:
	cd ../../Docker && docker-compose -f docker-compose-app.yaml up -d --build springboot

# build 為 re 的別名
build: re

logs:
	cd ../../Docker && docker-compose -f docker-compose-app.yaml logs -f springboot
