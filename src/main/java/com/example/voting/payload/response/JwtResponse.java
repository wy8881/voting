package com.example.voting.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private String username;
	private String email;
	private String role;

	public JwtResponse(String accessToken, String username, String email, String role) {
		this.token = accessToken;
		this.username = username;
		this.email = email;
		this.role = role;
	}

}
