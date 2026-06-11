package com.penguin.template.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.penguin.template.domain.auth.filter.JWTAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurity {

	private final JWTAuthenticationFilter jwtFilter;

	public WebSecurity(JWTAuthenticationFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.addFilterBefore(jwtFilter, BasicAuthenticationFilter.class)
				.authorizeHttpRequests(req -> req
					.requestMatchers("/swagger-ui/**").permitAll()
					.requestMatchers("/swagger-ui.html").permitAll()
					.requestMatchers("/swagger-ui").permitAll()
					.requestMatchers("/api/v3/api-docs/**").permitAll()
					.requestMatchers("/v3/api-docs/**").permitAll()
					.requestMatchers("/api/users/token").permitAll()
					.requestMatchers(HttpMethod.POST, "/api/users/signIn").permitAll()
					.requestMatchers(HttpMethod.POST, "/api/users/signUp").permitAll()
					.anyRequest().authenticated())
				.build();
	}
}
