package com.example.voting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VoterResponse {
	private String username;
	private String email;
	private String role;
	private Boolean isVoted;

}

