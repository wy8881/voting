package com.example.voting.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VoteRequest {
    private String voterName;
    private  List<String> preferences;
    private String type;
}

