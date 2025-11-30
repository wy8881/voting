package com.example.voting.dto.response;

public class VoterResponse {
	private String username;
	private String email;
	private String role;
	private Boolean isVoted;

	public VoterResponse() {
	}

	public VoterResponse(String username, String email, String role, Boolean isVoted) {
		this.username = username;
		this.email = email;
		this.role = role;
		this.isVoted = isVoted;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Boolean getIsVoted() {
		return isVoted;
	}

	public void setIsVoted(Boolean isVoted) {
		this.isVoted = isVoted;
	}
}

