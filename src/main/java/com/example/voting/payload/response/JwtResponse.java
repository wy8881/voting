package com.example.voting.payload.response;

import lombok.Getter;

import java.util.List;

public class JwtResponse {
	private String token;
	private String type = "Bearer";
	@Getter
	private String id;
	@Getter
	private String username;
	@Getter
	private String email;
	private String role;

	public JwtResponse(String accessToken, String id, String username, String email, String role) {
		this.token = accessToken;
		this.id = id;
		this.username = username;
		this.email = email;
		this.role = role;
	}

	public String getAccessToken() {
		return token;
	}

	public void setAccessToken(String accessToken) {
		this.token = accessToken;
	}

	public String getTokenType() {
		return type;
	}

	public void setTokenType(String tokenType) {
		this.type = tokenType;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
