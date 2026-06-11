package com.penguin.template.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "__PROJECT_DISPLAY__ API",
        version = "1.0.0",
        description = "__PROJECT_DISPLAY__ API，使用 JWT Bearer token 做驗證。"
    ),
    servers = {
        @Server(url = "/api", description = "全域 API prefix")
    },
    security = {
        @SecurityRequirement(name = "BearerAuth")
    }
)
@SecurityScheme(
    name = "BearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {
}
