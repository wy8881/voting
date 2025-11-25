package com.example.voting.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JWTResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Boolean isVoted;
}
