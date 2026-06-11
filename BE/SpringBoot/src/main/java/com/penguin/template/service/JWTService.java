package com.penguin.template.service;

import java.util.UUID;

import com.penguin.template.domain.auth.AuthClaim;

public interface JWTService {
	String generateToken(UUID userId, String email, String username);

	Boolean verifyToken(String token);

	AuthClaim parseBearerToken(String token);
}