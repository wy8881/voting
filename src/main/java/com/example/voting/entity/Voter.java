package com.example.voting.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "voter")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Voter {
    @Id
    private String id;

    private String username;
    private String password;
    private boolean vote;
    private List<String> candidates;
    private List<String> party;
}
