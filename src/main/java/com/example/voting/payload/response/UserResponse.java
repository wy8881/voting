package com.example.voting.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {
	private String username;
	private String email;
	private String role;
	private Boolean isVoted;

}
