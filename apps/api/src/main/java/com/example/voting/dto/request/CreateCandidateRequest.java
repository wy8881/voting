package com.example.voting.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCandidateRequest {
    private String name;
    private String party;
    private String rank;
}

