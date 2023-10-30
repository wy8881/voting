package com.example.voting.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCandidateRequest {
    private String name;
    private String party;
}
