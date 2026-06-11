# ---- build stage：容器內打包 jar，不需 host 先 mvn ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# 先複製 pom 抓依賴，利用 layer cache（只有 src 改動時不必重抓）
COPY SpringBoot/pom.xml .
RUN mvn -q dependency:go-offline
COPY SpringBoot/src ./src
RUN mvn -q clean package -DskipTests

# ---- run stage：JRE 跑 fat jar（pom finalName=app）----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/app.jar /app/app.jar
EXPOSE 8080 5005
# 保留 remote debug（5005）供本機開發；正式環境用 Dockerfile.prod
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
