package com.example.voting.dto.response;

public class JWTResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Boolean isVoted;

    public JWTResponse() {
    }

    public JWTResponse(String token, String username, String email, String role, Boolean isVoted) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.isVoted = isVoted;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

